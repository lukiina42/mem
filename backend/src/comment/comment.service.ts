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

export interface CommentsDto {
  id: number;
  content: string;
  parent_id: null | number;
  created_date: Date;
  answers?: CommentsDto[];
}

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

  async getMemComments(memId: string) {
    let parsedMemId;
    try {
      parsedMemId = parseInt(memId);
    } catch (exception) {
      throw new BadRequestException(exception.message);
    }

    const comments: CommentsDto[] = await this.commentsRepository.query(
      `WITH RECURSIVE comments_tree AS (
      -- Base case: select top-level comments for the post
      SELECT id, content, parent_id, created_date, owner_id FROM comment
      WHERE mem_id = $1
        AND parent_id IS NULL
      UNION ALL
      -- Recursive case: select answers for each comment in the previous level
      SELECT c.id, c.content, c.parent_id, c.created_date, c.owner_id
      FROM comment c
      JOIN comments_tree ct ON ct.id = c.parent_id
    )
    SELECT * FROM comments_tree ORDER BY parent_id DESC;`,
      [parsedMemId],
    );

    //n^2 complexity, should limit the amount of comments to fetch. If this total ripoff of an app would have more users that is :)))))))))))))))))))))))))
    const commentsArrayDto: CommentsDto[] = [];
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      if (!comment.parent_id) {
        commentsArrayDto.push(comment);
      } else {
        const parentComment = this.findCommentWithId(
          comments,
          comment.parent_id,
        );
        if (!parentComment.answers) parentComment.answers = [];
        parentComment.answers.push(comment);
      }
    }

    return commentsArrayDto;
  }

  findCommentWithId(comments: CommentsDto[], id) {
    return comments.find((comment) => comment.id === id);
  }
}
