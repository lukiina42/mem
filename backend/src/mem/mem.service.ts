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
import { mapMemsDbToDto } from 'src/mapper/memMapper';
import { Notification } from 'src/notifications/notification.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

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
    private notificationsService: NotificationsService,
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

  async getRelevantMems(userId: number) {
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
        .take(10)
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
        .take(10)
        .getMany();
    }

    return {
      mems: await mapMemsDbToDto(mems, user, this.s3Service),
      isUserFollowingAnyone: user.following.length > 0,
    };
  }

  async getNewestMems(userId: number) {
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
      .take(10)
      .getMany();

    return mapMemsDbToDto(mems, user, this.s3Service);
  }

  async getMemsOfUser(userId: string, requestingUserId: string) {
    const id = parseInt(userId);
    const idOfRequestingUser = parseInt(requestingUserId);

    let requestingUser: null | User = null;
    if (requestingUserId) {
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
      .take(10)
      .getMany();

    return mapMemsDbToDto(mems, requestingUser, this.s3Service);
  }

  async deleteMem(userId: number, id: string) {
    const idNumber = parseInt(id);
    const memOwner = await this.usersService.findOneByIdWithMems(userId);
    if (!memOwner) throw new BadRequestException('The user was not found');

    if (!memOwner.mems.some((mem) => mem.id === idNumber)) {
      throw new BadRequestException(
        'The user attempted to delete mem which is not theirs',
      );
    }
    const memToDelete = await this.memRepository.findOneBy({ id: idNumber });
    if (!memToDelete)
      throw new BadRequestException(
        'The mem which should be deleted does not exist',
      );
    await this.s3Service.deleteImage(memToDelete.imageKey);
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
      'heartedMem',
    );

    await this.usersService.updateUser(likedByUser);
  }
}
