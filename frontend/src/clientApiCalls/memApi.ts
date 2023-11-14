import { Mem } from '@/types/mem';
import { handleError, handleResponseWithoutJson, handleResponseWithJson } from './apiUtils';

export const createMem = (variables: {
  content: string;
  image: File | null;
  token?: string;
  userEmail: string;
}): Promise<string | void> => {
  const variablesCopy = { ...variables };
  delete variablesCopy.token;

  const formData = new FormData();
  formData.append('image', variables.image as File);
  formData.append('content', variables.content);
  formData.append('userEmail', variables.userEmail);

  return fetch(`http://localhost:8080/mems/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${variables.token}`,
    },

    body: formData,
  })
    .then((response) => handleResponseWithoutJson(response, 204))
    .catch(handleError);
};

export const deleteMem = (variables: { memId: number; token: string }): Promise<string | void> => {
  return fetch(`http://localhost:8080/mems/delete/${variables.memId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${variables.token}`,
      'Content-type': 'application/json',
    },
  })
    .then((response) => handleResponseWithoutJson(response, 204))
    .catch(handleError);
};

export const heartMem = (variables: { memId: number; token: string }): Promise<string | void> => {
  const { memId, token } = variables;
  return fetch(`http://localhost:8080/mems/heart/${memId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => handleResponseWithoutJson(response, 204))
    .catch(handleError);
};

export const getMems = (variables: {
  token: string;
  from: number;
  to: number;
  requestUrl: string;
  requestingUser?: string;
}): Promise<Mem[]> => {
  return fetch(
    `http://localhost:8080/mems${variables.requestUrl}?from=${variables.from}&to=${
      variables.to
    }&requestingUser=${variables.requestingUser && variables.requestingUser}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${variables.token}`,
        'Content-type': 'application/json',
      },
    }
  )
    .then((response) => handleResponseWithJson(response, 200))
    .catch(handleError);
};

export const getMem = (variables: {
  id: number;
  token: string;
  requestUserId: string;
}): Promise<Mem> => {
  return fetch(
    `http://localhost:8080/mems/${variables.id}?requestingUserId=${variables.requestUserId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${variables.token}`,
        'Content-type': 'application/json',
      },
    }
  )
    .then((response) => handleResponseWithJson(response, 200))
    .catch(handleError);
};
