import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mem } from './mem.entity';
import { MemsService } from './mem.service';
import { MemsController } from './mem.controller';
import { UsersModule } from 'src/user/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mem]), UsersModule],
  exports: [TypeOrmModule],
  providers: [MemsService],
  controllers: [MemsController],
})
export class MemsModule {}
