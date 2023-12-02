import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mem } from './mem.entity';
import { UsersService } from 'src/user/users.service';
import { S3Service } from 'src/s3/s3.service';
import { nanoid } from 'nanoid';
import { User } from 'src/user/user.entity';
import { mapMemsDbToDto, mapMemDbToDto } from 'src/mapper/memMapper';
import { NotificationService } from 'src/notifications/notification.service';
import { Role } from 'src/user/roles/role.enum';

export interface MemDto extends Mem {
  imageUrl?: string;
  heartedByCurrentUser?: boolean;
  hearts?: number;
  lastUpdateDate?: string;
}

@Injectable()
export class MemsService {
  constructor(
    @InjectRepository(Mem)
    private memRepository: Repository<Mem>,
    private usersService: UsersService,
    private s3Service: S3Service,
    private notificationsService: NotificationService,
  ) {}

  async findOneById(id: number): Promise<Mem> {
    return await this.memRepository.findOneBy({ id });
  }

  async findOneByIdWithOwnerId(id: number): Promise<Mem> {
    return await this.memRepository
      .createQueryBuilder('mem')
      .where('mem.id = :id', { id })
      .leftJoinAndSelect('mem.owner', 'owner')
      .getOne();
  }

  async findOneByIdWithHeartedByAndOwner(id: number): Promise<Mem> {
    return await this.memRepository
      .createQueryBuilder('mem')
      .where('mem.id = :id', { id })
      .leftJoinAndSelect('mem.heartedBy', 'heartedBy')
      .leftJoinAndSelect('mem.owner', 'owner')
      .getOne();
  }

  async retrieveMemWithImageUrl(id: number, userId: number): Promise<Mem> {
    const mem = await this.findOneByIdWithHeartedByAndOwner(id);
    let user = null;
    if (userId) {
      user = await this.usersService.findOneByIdWithHeartedMems(userId);
    }
    return await mapMemDbToDto(mem, this.s3Service, user);
  }

  async createMem(
    userEmail: string,
    image?: Express.Multer.File,
    content?: string,
  ) {
    if (!image && !content)
      throw new BadRequestException(
        'Either text content or image must be present!',
      );

    const user = await this.usersService.findOneByEmail(userEmail);

    let newMem;

    if (image) {
      const id = nanoid(40);

      await this.s3Service.storeImage(image, id);

      if (content) {
        newMem = new Mem(content, id);
      } else {
        newMem = new Mem('', id);
      }
    } else {
      newMem = new Mem(content);
    }

    newMem.owner = user;

    const mem = await this.memRepository.save(newMem);

    return mem.id;
  }

  async getRelevantMems(userId: number, from: string, to: string) {
    const { parsedFrom, parsedTo } = this.parseFromAndToToNumber(from, to);
    const user =
      await this.usersService.findOneByIdWithHeartedMemsAndWithFollowingUsers(
        userId,
      );
    if (!user) throw new NotFoundException('User was not found');

    let mems;

    //if user  is not following anyone, return only the newest mems
    if (user.following.length == 0) {
      mems = await this.memRepository
        .createQueryBuilder('mem')
        .orderBy('mem.createdDate', 'DESC')
        .leftJoinAndSelect('mem.owner', 'owner')
        .leftJoinAndSelect('mem.heartedBy', 'heartedBy')
        .skip(parsedFrom)
        .take(parsedTo - parsedFrom + 1)
        .getMany();
    } else {
      mems = await this.memRepository
        .createQueryBuilder('mem')
        .leftJoinAndSelect('mem.owner', 'owner')
        .where('mem.owner.id IN(:...ids)', {
          ids: user.following.map((user) => user.id),
        })
        .orderBy('mem.createdDate', 'DESC')
        .leftJoinAndSelect('mem.heartedBy', 'heartedBy')
        .skip(parsedFrom)
        .take(parsedTo - parsedFrom + 1)
        .getMany();
    }

    return {
      mems: await mapMemsDbToDto(mems, user, this.s3Service),
      isUserFollowingAnyone: user.following.length > 0,
    };
  }

  parseFromAndToToNumber = (from: string, to: string) => {
    let parsedFrom, parsedTo;
    try {
      parsedFrom = parseInt(from);
      parsedTo = parseInt(to);
    } catch (e) {
      throw new BadRequestException('Invalid from or to query params');
    }
    return { parsedFrom, parsedTo };
  };

  async getNewestMems(userId: number, from: string, to: string) {
    const { parsedFrom, parsedTo } = this.parseFromAndToToNumber(from, to);

    const user =
      await this.usersService.findOneByIdWithHeartedMemsAndWithFollowingUsers(
        userId,
      );
    if (!user) throw new NotFoundException('User was not found');

    const mems = await this.memRepository
      .createQueryBuilder('mem')
      .orderBy('mem.createdDate', 'DESC')
      .leftJoinAndSelect('mem.owner', 'owner')
      .leftJoinAndSelect('mem.heartedBy', 'heartedBy')
      .skip(parsedFrom)
      .take(parsedTo - parsedFrom + 1)
      .getMany();

    console.log(mems)

    return mapMemsDbToDto(mems, user, this.s3Service);
  }

  async getMemsOfUser(
    userId: string,
    requestingUserId: string,
    from: string,
    to: string,
  ) {
    const { parsedFrom, parsedTo } = this.parseFromAndToToNumber(from, to);
    const id = parseInt(userId);
    const idOfRequestingUser = requestingUserId
      ? parseInt(requestingUserId)
      : 0;

    let requestingUser: null | User = null;
    if (idOfRequestingUser) {
      requestingUser = await this.usersService.findOneByIdWithHeartedMems(
        idOfRequestingUser,
      );
      if (!requestingUser) throw new NotFoundException('User was not found');
    }

    const mems = await this.memRepository
      .createQueryBuilder('mem')
      .leftJoinAndSelect('mem.owner', 'owner')
      .where('mem.owner.id = :id', { id })
      .orderBy('mem.createdDate', 'DESC')
      .leftJoinAndSelect('mem.heartedBy', 'heartedBy')
      .skip(parsedFrom)
      .take(parsedTo - parsedFrom + 1)
      .getMany();

    return mapMemsDbToDto(mems, requestingUser, this.s3Service);
  }

  async deleteMem(userId: number, id: string) {
    const idNumber = parseInt(id);
    const memOwner = await this.usersService.findOneByIdWithMems(userId);
    if (!memOwner) throw new BadRequestException('The user was not found');

    if (!memOwner.mems.some((mem) => mem.id === idNumber)) {
      if (!memOwner.roles.includes(Role.ADMIN)) {
        throw new BadRequestException(
          'The user attempted to delete mem which is not theirs',
        );
      }
    }
    const memToDelete = await this.memRepository.findOneBy({ id: idNumber });
    if (!memToDelete)
      throw new BadRequestException(
        'The mem which should be deleted does not exist',
      );
    if (memToDelete.imageKey) this.s3Service.deleteImage(memToDelete.imageKey);
    await this.memRepository.remove(memToDelete);
  }

  async heartMem(userId: number, id: string) {
    const idNumber = parseInt(id);
    const likedByUser = await this.usersService.findOneByIdWithMems(userId);
    if (!likedByUser) throw new BadRequestException('The user was not found');

    const memToLike = await this.findOneByIdWithOwnerId(idNumber);

    if (!memToLike)
      throw new NotFoundException('The mem to like was not found');

    if (!likedByUser.heartedMems) likedByUser.heartedMems = [];

    const userMemeAlreadyLiked = likedByUser.heartedMems.find(
      (mem) => mem.id === memToLike.id,
    );

    if (!userMemeAlreadyLiked) {
      likedByUser.heartedMems.push(memToLike);
    } else
      likedByUser.heartedMems = likedByUser.heartedMems.filter(
        (mem) => mem.id !== memToLike.id,
      );

    await this.notificationsService.createNotification(
      memToLike.owner,
      likedByUser,
      memToLike,
      `${userMemeAlreadyLiked ? 'unheartedMem' : 'heartedMem'}`,
    );

    await this.usersService.updateUser(likedByUser);
  }
}

