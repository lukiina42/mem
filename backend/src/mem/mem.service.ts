import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mem } from './mem.entity';
import { UsersService } from 'src/user/users.service';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

@Injectable()
export class MemsService {
  constructor(
    @InjectRepository(Mem)
    private memRepository: Repository<Mem>,
    private usersService: UsersService,
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

    const bucketName = process.env.AWS_BUCKET_NAME;
    const bucketRegion = process.env.AWS_BUCKET_REGION;
    const accessKey = process.env.AWS_ACCESS_KEY;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    console.log({ bucketName, bucketRegion, accessKey, secretAccessKey });

    const s3 = new S3Client({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
      },
      region: bucketRegion,
    });

    const params = {
      Bucket: bucketName,
      Key: id,
      Body: image.buffer,
      ContentType: image.mimetype,
    };

    const command = new PutObjectCommand(params);

    await s3.send(command);

    // const sharp = await import('sharp');

    // const buffer = await sharp(image.buffer)
    //   .resize({ height: 1920, width: 1080, fit: 'contain' })
    //   .toBuffer();

    const newMem = new Mem(content, id);
    newMem.owner = user;

    const mem = await this.memRepository.save(newMem);

    return mem.id;
  }
}
