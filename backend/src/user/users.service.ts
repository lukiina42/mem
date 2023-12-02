import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';
import { genSalt, hash, compare as comparePasswords } from 'bcrypt';
import { S3Service } from 'src/s3/s3.service';
import { nanoid } from 'nanoid';
import { NotificationService } from 'src/notifications/notification.service';
import { PotentialFriend } from './users.api-return-types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private s3Service: S3Service,
    private notificationsService: NotificationService,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateUser(user: User) {
    await this.usersRepository.save(user);
  }

  async addImageUrlToUser(user: User) {
    if (user.avatarImageKey) {
      const avatarImageUrl = await this.s3Service.retrieveImage(
        user.avatarImageKey,
      );
      user.avatarImageUrl = avatarImageUrl;
      return user;
    }
  }

  async findOneByIdWithHeartedMems(id: number): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.heartedMems', 'heartedMems')
      .where('user.id = :id', { id })
      .getOne();

    return user;
  }

  async findOneByIdWithMems(id: number): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.mems', 'mems')
      .leftJoinAndSelect('user.heartedMems', 'heartedMems')
      .where('user.id = :id', { id })
      .getOne();

    return user;
  }

  async findOneByIdWithHeartedMemsAndWithFollowingUsers(
    id: number,
  ): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.heartedMems', 'heartedMems')
      .leftJoinAndSelect('user.following', 'following')
      .where('user.id = :id', { id })
      .getOne();

    return user;
  }

  async findOneByIdWithAvatar(idString: string): Promise<User> {
    const id = this.parseStringToId(idString);
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.followedBy', 'followedBy')
      .getOne();

    if (!user) throw new NotFoundException(`User with id ${id} was not found`);

    await this.addImageUrlToUser(user);

    return user;
  }

  async findPotentialFriendsOfUser(id: number): Promise<PotentialFriend[]> {
    const userWithFollowing = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.following', 'following')
      .leftJoinAndSelect('following.following', 'doublefollowing')
      .where('user.id = :id', { id })
      .getOne();

    if (!userWithFollowing)
      throw new NotFoundException(`User with id ${id} was not found`);

    if (userWithFollowing.following.length == 0) {
      const usersWithMostFollowing: { id: string; count: string }[] =
        await this.usersRepository
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.following', 'following')
          .groupBy('following.id') // here is where we group by the tag so we can count
          .addGroupBy('following.id')
          .select('following.id, count(following.id)') // here is where we count :)
          .orderBy('count(following.id)', 'DESC')
          .limit(2) // here is the limit
          .execute();
      const usersWithAvatarImage: PotentialFriend[] = [];
      for (let i = 0; i < usersWithMostFollowing.length; i++) {
        const userFollowersAmount = usersWithMostFollowing[i];
        if(userFollowersAmount.id !== null) {
          usersWithAvatarImage.push({
            ...(await this.findOneByIdWithAvatar(userFollowersAmount.id)),
            commonFollowersPresent: false,
            followersAmount: parseInt(userFollowersAmount.count),
          });
        }
      }
      return usersWithAvatarImage;
    }

    const recommendedUsersMap = new Map<string, PotentialFriend>();

    for (let i = 0; i < userWithFollowing.following.length; i++) {
      const followedUser = userWithFollowing.following[i];
      for (let i = 0; i < followedUser.following.length; i++) {
        const potentialRecommendation = followedUser.following[i];
        if (potentialRecommendation.id != id) {
          const userFromMap = recommendedUsersMap.get(
            potentialRecommendation.username,
          );
          recommendedUsersMap.set(
            potentialRecommendation.username,
            userFromMap
              ? {
                  ...userFromMap,
                  commonFollowersPresent: true,
                  //@ts-ignore
                  commonFollowersAmount: userFromMap.commonFollowersAmount + 1,
                }
              : {
                  ...potentialRecommendation,
                  commonFollowersPresent: true,
                  commonFollowersAmount: 1,
                },
          );
        }
      }
    }
    const resultArray = Array.from(
      recommendedUsersMap,
      ([name, value]) => value,
    );
    for (let i = 0; i < resultArray.length; i++) {
      const currentUser = resultArray[i];
      if (currentUser.avatarImageKey) {
        currentUser.avatarImageUrl = await this.s3Service.retrieveImage(
          currentUser.avatarImageKey,
        );
      }
    }
    return resultArray.sort(
      (user1, user2) =>
        (user1.commonFollowersPresent && user1.commonFollowersAmount) -
        (user2.commonFollowersPresent && user2.commonFollowersAmount),
    );
  }

  async findOneByIdRaw(id: number): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    return user;
  }

  async findOneByIdWithFollowingUsers(id: number): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.following', 'following')
      .getOne();

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  async loginUser(email: string, password: string): Promise<boolean> {
    const user = await this.findOneByEmail(email);
    if (!user) return false;
    // check user password with hashed password stored in the database
    const validPassword = await comparePasswords(password, user.password);
    return validPassword;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async createUser(user: User): Promise<void> {
    // generate salt to hash password
    const salt = await genSalt(10);
    // now we set user password to hashed password
    user.password = await hash(user.password, salt);
    user.heartedMems = [];
    await this.usersRepository.insert(user);
  }

  async updateAvatar(userId: number, image: Express.Multer.File) {
    const user = await this.findOneByIdRaw(userId);
    if (!user)
      throw new NotFoundException(
        'The user who made the request was not found',
      );
    if (!image) {
      if (user.avatarImageKey) {
        await this.s3Service.deleteImage(user.avatarImageKey);
        user.avatarImageKey = '';
        await this.updateUser(user);
        return;
      }
    } else {
      const newKey = nanoid(40);
      if (user.avatarImageKey) {
        await this.s3Service.deleteImage(user.avatarImageKey);
      }
      await this.s3Service.storeImage(image, newKey);
      user.avatarImageKey = newKey;
      await this.updateUser(user);
    }
  }

  async followUser(followingId: number, followedId: number) {
    const followedUser = await this.findOneByIdRaw(followedId);
    if (!followedUser)
      throw new NotFoundException('The followed user was not found');

    const followingUser = await this.findOneByIdWithFollowingUsers(followingId);
    if (!followingUser)
      throw new NotFoundException(
        'The user who made the request was not found',
      );

    if (!followingUser.following) {
      followingUser.following = [];
    }

    const filteredFollowingList = followingUser.following.filter(
      (user) => user.id !== followedId,
    );

    const newFollow =
      filteredFollowingList.length == followingUser.following.length;

    if (newFollow) {
      followingUser.following.push(followedUser);
    } else {
      followingUser.following = filteredFollowingList;
    }

    if (newFollow)
      await this.notificationsService.createNotification(
        followedUser,
        followingUser,
        undefined,
        'newFollow',
      );

    await this.updateUser(followingUser);
  }

  parseStringToId = (str: string) => {
    try {
      return parseInt(str);
    } catch (ex) {
      throw new BadRequestException('The string is not parseable to int');
    }
  };

  async banUser(idString: string) {
    const id = this.parseStringToId(idString);
    const userToBan = await this.findOneByIdRaw(id);
    if (!userToBan)
      throw new NotFoundException('The user to be banned was not found');

    userToBan.isBanned = userToBan.isBanned ? false : true;
    await this.updateUser(userToBan);
  }

  async checkUserBanned(userId: number) {
    const user = await this.findOneByIdRaw(userId);
    return user.isBanned;
  }
}

