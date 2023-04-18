import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/user/users.service';
import { MemsService } from 'src/mem/mem.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly memsService: MemsService,
  ) {}

  async findOneById(id: number): Promise<Comment> {
    return this.commentsRepository.findOneBy({ id });
  }

  async createComment(
    content: string,
    ownerId: number,
    memId: string,
    parentCommentId: string,
  ) {
    if (!content) throw new BadRequestException('Comment must contain text');
    const user = await this.usersService.findOneByIdRaw(ownerId);
    if (!user)
      throw new NotFoundException(
        'The user who made the request was not found',
      );
    if (!memId && !parentCommentId) {
      throw new BadRequestException(
        'Either mem id or parent comment id must be filled!',
      );
    }
    const comment = new Comment(content);
    comment.owner = user;
    if (memId) {
      try {
        const parsedMemId = parseInt(memId);
        const memParent = await this.memsService.findOneById(parsedMemId);
        if (!memParent)
          throw new BadRequestException('The parent mem was not found');
        comment.mem = memParent;
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
    if (parentCommentId) {
      try {
        const parsedCommentId = parseInt(parentCommentId);
        const commentParent = await this.findOneById(parsedCommentId);
        if (!commentParent)
          throw new BadRequestException('The parent comment was not found');
        comment.parent = commentParent;
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
    this.commentsRepository.save(comment);
    return;
  }
}
