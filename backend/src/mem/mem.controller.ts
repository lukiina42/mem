import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  NotFoundException,
  ClassSerializerInterceptor,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MemsService } from './mem.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JWTReqUser } from 'src/types';

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
    @Request() req: JWTReqUser,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.memService.createMem(image, content, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getRelevantMems(@Request() req: JWTReqUser) {
    return await this.memService.getRelevantMems(req.user.userId);
  }
}
