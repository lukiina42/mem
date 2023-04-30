import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mem } from './mem.entity';
import { MemsService } from './mem.service';
import { MemsController } from './mem.controller';
import { UsersModule } from 'src/user/users.module';
import { S3Service } from 'src/s3/s3.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mem]), UsersModule, NotificationsModule],
  exports: [TypeOrmModule, MemsService],
  providers: [MemsService, S3Service],
  controllers: [MemsController],
})
export class MemsModule {}
