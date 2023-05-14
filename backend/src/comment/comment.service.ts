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
import { mapCommentDbToCommentDto } from 'src/mapper/commentMapper';
import { S3Service } from 'src/s3/s3.service';
import { NotificationService } from 'src/notifications/notification.service';

export interface CommentDb {
  id: number;
  content: string;
  parent_id: null | number;
  owner_id: number;
  created_date: Date;
  username: string;
  answers?: CommentDb[];
  avatar_image_key?: string;
}

export interface CommentDto {
  id: number;
  parentId: number;
  content: string;
  createdDate: Date;
  ownerUsername: string;
  ownerId: number;
  answers?: CommentDto[];
  ownerAvatarUrl?: string;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly memsService: MemsService,
    private readonly s3Service: S3Service,
    private notificationsService: NotificationService,
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
        const memParent = await this.memsService.findOneByIdWithOwnerId(
          parsedMemId,
        );
        if (!memParent)
          throw new BadRequestException('The parent mem was not found');
        comment.mem = memParent;
        this.notificationsService.createNotification(
          memParent.owner,
          user,
          memParent,
          'newComment',
        );
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

    const comments: CommentDb[] = await this.commentsRepository.query(
      `WITH RECURSIVE comments_tree AS (
      -- Base case: select top-level comments for the post
      SELECT c.id, c.content, c.parent_id, c.created_date, u.username, u.avatar_image_key, c.owner_id FROM comment c INNER JOIN "user" u ON c.owner_id = u.id
      WHERE c.mem_id = $1
        AND c.parent_id IS NULL
      UNION ALL
      -- Recursive case: select answers for each comment in the previous level
      SELECT c.id, c.content, c.parent_id, c.created_date, u.username, u.avatar_image_key, c.owner_id
      FROM comment c
      INNER JOIN "user" u ON c.owner_id = u.id
      JOIN comments_tree ct ON ct.id = c.parent_id
    )
    SELECT * FROM comments_tree ORDER BY created_date DESC;`,
      [parsedMemId],
    );

    const commentsDto = await Promise.all(
      comments.map((comment) =>
        mapCommentDbToCommentDto(comment, this.s3Service),
      ),
    );

    //n^2 complexity, should limit the amount of comments to fetch. If this total ripoff of an app would have more users that is :)))))))))))))))))))))))))
    const commentsArrayDto: CommentDto[] = [];
    for (let i = 0; i < commentsDto.length; i++) {
      const comment = commentsDto[i];
      if (!comment.parentId) {
        commentsArrayDto.push(comment);
      } else {
        const parentComment = this.findCommentWithId(
          commentsDto,
          comment.parentId,
        );
        if (!parentComment.answers) parentComment.answers = [];
        parentComment.answers.push(comment);
      }
    }

    return commentsArrayDto;
  }

  findCommentWithId(comments: CommentDto[], id: number) {
    return comments.find((comment) => comment.id === id);
  }
}
