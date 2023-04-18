import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comment.service';
import { Comment } from './comment.entity';
import { CommentsController } from './comment.controller';
import { UsersModule } from 'src/user/users.module';
import { MemsModule } from 'src/mem/mem.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersModule, MemsModule],
  exports: [TypeOrmModule, CommentsService],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
