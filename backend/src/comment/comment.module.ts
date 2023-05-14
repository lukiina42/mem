import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comment.service';
import { Comment } from './comment.entity';
import { CommentsController } from './comment.controller';
import { UsersModule } from 'src/user/users.module';
import { MemsModule } from 'src/mem/mem.module';
import { S3Service } from 'src/s3/s3.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    UsersModule,
    MemsModule,
    NotificationsModule,
  ],
  exports: [TypeOrmModule, CommentsService],
  providers: [CommentsService, S3Service],
  controllers: [CommentsController],
})
export class CommentsModule {}
