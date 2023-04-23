import { CommentDto, CommentDb } from 'src/comment/comment.service';
import { S3Service } from 'src/s3/s3.service';

export const mapCommentDbToCommentDto = async (
  comment: CommentDb,
  s3Service: S3Service,
): Promise<CommentDto> => {
  const ownerAvatarUrl = comment.avatar_image_key
    ? await s3Service.retrieveImage(comment.avatar_image_key)
    : '';

  return {
    id: comment.id,
    ownerId: comment.owner_id,
    content: comment.content,
    parentId: comment.parent_id,
    createdDate: comment.created_date,
    ownerUsername: comment.username,
    ownerAvatarUrl,
  };
};
