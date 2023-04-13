import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3: S3Client;
  constructor() {
    const bucketRegion = process.env.AWS_BUCKET_REGION;
    const accessKey = process.env.AWS_ACCESS_KEY;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
      },
      region: bucketRegion,
    });
  }

  async storeImage(image: Express.Multer.File, key: string) {
    const bucketName = process.env.AWS_BUCKET_NAME;

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: image.buffer,
      ContentType: image.mimetype,
    };

    const command = new PutObjectCommand(params);

    await this.s3.send(command);
  }

  async retrieveImage(imageKey: string) {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const getObjectParams = {
      Bucket: bucketName,
      Key: imageKey,
    };

    const getObjectCommand = new GetObjectCommand(getObjectParams);

    const url = await getSignedUrl(this.s3, getObjectCommand, {
      expiresIn: 24000,
    });

    return url;
  }

  async deleteImage(imageKey: string) {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const deleteObjectParams = {
      Bucket: bucketName,
      Key: imageKey,
    };

    const deleteObjectCommand = new DeleteObjectCommand(deleteObjectParams);

    await this.s3.send(deleteObjectCommand);
  }
}
