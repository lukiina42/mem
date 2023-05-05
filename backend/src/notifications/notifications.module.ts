import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notification.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationsController } from './notification.controller';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationsGateway, NotificationService, S3Service],
  exports: [NotificationService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
