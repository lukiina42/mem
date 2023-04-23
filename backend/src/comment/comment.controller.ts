import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JWTReqUser } from 'src/types';

@Controller('/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @HttpCode(204)
  async createComment(
    @Body('content') content: string,
    @Body('parentMemId') memId: string,
    @Body('parentCommentId') parentCommentId: string,
    @Request() req: JWTReqUser,
  ) {
    return await this.commentsService.createComment(
      content,
      req.user.userId,
      memId,
      parentCommentId,
    );
  }

  @Get('/mem/:id')
  @HttpCode(200)
  async getMemComments(@Param('id') memId: string) {
    return await this.commentsService.getMemComments(memId);
  }
}
