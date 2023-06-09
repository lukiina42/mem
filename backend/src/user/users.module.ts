import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { S3Service } from 'src/s3/s3.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), NotificationsModule],
  exports: [TypeOrmModule, UsersService],
  providers: [UsersService, S3Service],
  controllers: [UsersController],
})
export class UsersModule {}
