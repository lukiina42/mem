import { CommentDto, CommentDb } from 'src/comment/comment.service';

export const mapCommentDbToCommentDto = (comment: CommentDb): CommentDto => {
  return {
    id: comment.id,
    ownerId: comment.owner_id,
    content: comment.content,
    parentId: comment.parent_id,
    createdDate: comment.created_date,
    ownerUsername: comment.username,
  };
};
