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

export interface MemFE extends Mem {
  imageUrl?: string;
  heartedByCurrentUser?: boolean;
  hearts?: number;
}

@Injectable()
export class MemsService {
  constructor(
    @InjectRepository(Mem)
    private memRepository: Repository<Mem>,
    private usersService: UsersService,
    private s3Service: S3Service,
  ) {}

  async findOneById(id: number): Promise<Mem> {
    return this.memRepository.findOneBy({ id });
  }

  async createMem(
    image: Express.Multer.File,
    content: string,
    userEmail: string,
  ) {
    const user = await this.usersService.findOneByEmail(userEmail);

    const id = nanoid(40);

    await this.s3Service.storeMemImage(image, id);

    // const sharp = await import('sharp');

    // const buffer = await sharp(image.buffer)
    //   .resize({ height: 1920, width: 1080, fit: 'contain' })
    //   .toBuffer();

    const newMem = new Mem(content, id);
    newMem.owner = user;

    const mem = await this.memRepository.save(newMem);

    return mem.id;
  }

  async getRelevantMems(userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new NotFoundException('User was not found');

    const mems = await this.memRepository
      .createQueryBuilder('mem')
      .leftJoinAndSelect('mem.owner', 'owner')
      .where('mem.owner.id = :id', { id: userId })
      .orderBy('mem.createdDate', 'DESC')
      .leftJoinAndSelect('mem.heartedBy', 'heartedBy')
      .limit(10)
      .getMany();

    const memsFe = [];

    for (let i = 0; i < mems.length; i++) {
      const mem: MemFE = mems[i];
      const imageUrl = await this.s3Service.retrieveMemImage(mem);
      mem.imageUrl = imageUrl;

      if (!user.heartedMems) {
        mem.heartedByCurrentUser = false;
      } else {
        if (user.heartedMems.find((userMem) => mem.id === userMem.id)) {
          mem.heartedByCurrentUser = true;
        } else {
          mem.heartedByCurrentUser = false;
        }
      }

      memsFe.push(mem);
    }

    return memsFe;
  }

  async deleteMem(userId: number, id: string) {
    const idNumber = parseInt(id);
    const memOwner = await this.usersService.findOneById(userId);
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
    await this.s3Service.deleteMemImage(memToDelete);
    await this.memRepository.remove(memToDelete);
  }

  async heartMem(userId: number, id: string) {
    const idNumber = parseInt(id);
    const likedByUser = await this.usersService.findOneById(userId);
    if (!likedByUser) throw new BadRequestException('The user was not found');

    const memToLike = await this.findOneById(idNumber);
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

    await this.usersService.updateUser(likedByUser);
  }
}
