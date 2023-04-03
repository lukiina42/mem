import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mem } from './mem.entity';

interface MemPayload {
  content: string;
  file: Express.Multer.File;
}

@Injectable()
export class MemsService {
  constructor(
    @InjectRepository(Mem)
    private memRepository: Repository<Mem>,
  ) {}

  async findOneById(id: number): Promise<Mem> {
    return this.memRepository.findOneBy({ id });
  }

  async createMem(mem: MemPayload): Promise<void> {
    console.log('Mem payload', mem);
  }
}
