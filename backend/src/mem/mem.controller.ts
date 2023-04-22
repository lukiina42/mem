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
  Delete,
  Put,
  Query,
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
    return await this.memService.createMem(req.user.email, image, content);
  }

  @Get('/user/:id')
  async getMemsOfUser(
    @Param('id') userId: string,
    @Query() query: { requestingUser: string },
  ) {
    return await this.memService.getMemsOfUser(userId, query.requestingUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getRelevantMems(@Request() req: JWTReqUser) {
    return await this.memService.getRelevantMems(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  @HttpCode(204)
  async deleteMem(@Request() req: JWTReqUser, @Param('id') id: string) {
    return await this.memService.deleteMem(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/heart/:id')
  @HttpCode(204)
  async heartMem(@Request() req: JWTReqUser, @Param('id') id: string) {
    return await this.memService.heartMem(req.user.userId, id);
  }
}
