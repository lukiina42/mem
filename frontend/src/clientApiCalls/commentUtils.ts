import { Comment } from "@/types/comment";
import { handleError, handleResponseWithJson } from "./apiUtils";

export const getComments = (variables: {
  memId: number;
}): Promise<Comment[]> => {
  return fetch(`http://localhost:8080/comments/mem/${variables.memId}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => handleResponseWithJson(response, 200))
    .catch(handleError);
};
