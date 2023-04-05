import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mem } from './mem.entity';
import { UsersService } from 'src/user/users.service';
import { S3Service } from 'src/s3/s3.service';
import { nanoid } from 'nanoid';

export interface MemFE extends Mem {
  imageUrl: string;
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
    const mems = await this.memRepository
      .createQueryBuilder('mem')
      .leftJoinAndSelect('mem.owner', 'owner')
      .where('mem.owner.id = :id', { id: userId })
      .orderBy('mem.createdDate', 'ASC')
      .limit(10)
      .getMany();

    return await this.s3Service.retrieveMems(mems);
  }
}
