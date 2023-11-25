import { Comment } from '@/types/comment';
import { handleError, handleResponseWithJson, handleResponseWithoutJson } from './apiUtils';

export const getComments = (variables: { memId: number }): Promise<Comment[]> => {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/comments/mem/${variables.memId}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((response) => handleResponseWithJson(response, 200))
    .catch(handleError);
};

export const createComment = (variables: {
  content: string;
  memParentId?: number;
  commentParentId?: number;
  token: string;
}): Promise<string | void> => {
  const isRoot = variables.memParentId ? true : false;

  const body = isRoot
    ? {
        content: variables.content,
        parentMemId: variables.memParentId,
      }
    : {
        content: variables.content,
        parentCommentId: variables.commentParentId,
      };

  return fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/comments/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${variables.token}`,
      'Content-type': 'application/json',
    },

    body: JSON.stringify(body),
  })
    .then((response) => handleResponseWithoutJson(response, 204))
    .catch(handleError);
};
