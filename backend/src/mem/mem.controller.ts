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
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMem(@Param('id') id: number, @Request() req: JWTReqUser) {
    const mem = await this.memService.retrieveMemWithImageUrl(
      id,
      req.user.userId,
    );
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
    console.log(`Getting mems of user ${userId}`);
    return await this.memService.getMemsOfUser(userId, query.requestingUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getRelevantMems(@Request() req: JWTReqUser) {
    return await this.memService.getRelevantMems(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/home/newest')
  async getNewestMems(@Request() req: JWTReqUser) {
    return await this.memService.getNewestMems(req.user.userId);
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
