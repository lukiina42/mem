import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  BadRequestException,
  NotFoundException,
  ClassSerializerInterceptor,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { MemsService } from './mem.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/mems')
export class MemsController {
  constructor(private readonly memService: MemsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getMem(@Param('id') id: number) {
    const mem = await this.memService.findOneById(id);
    if (!mem) throw new NotFoundException(`User with id ${id} was not found`);
    return mem;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(204)
  async createMem(
    @Body('content') content: string,
    @Body('userEmail') userEmail: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    console.log(content, userEmail, image);
  }
}
