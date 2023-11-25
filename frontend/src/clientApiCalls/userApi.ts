import { User } from '@/types/user';
import { handleError, handleResponseWithoutJson, handleResponseWithJson } from './apiUtils';

export const createUser = (variables: {
  email: string;
  password: string;
  username: string;
}): Promise<string | void> => {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(variables),
  })
    .then((response) => handleResponseWithoutJson(response, 204))
    .catch(handleError);
};

export const loginUser = (variables: {
  email: string;
  password: string;
}): Promise<{ token: string; user: User }> => {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: variables.email,
      password: variables.password,
    }),
  })
    .then((response) => handleResponseWithJson(response, 201))
    .catch(handleError);
};

export const getUser = (variables: { id: number }): Promise<User> => {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/users/${variables.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => handleResponseWithJson(response, 200))
    .catch(handleError);
};

export const updateAvatar = (variables: {
  file: File | null;
  token: string;
}): Promise<string | void> => {
  let formData = null;
  if (variables.file) {
    formData = new FormData();
    formData.append('image', variables.file as File);
  }

  return fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/users/avatar`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${variables.token}`,
    },
    body: formData,
  })
    .then((response) => handleResponseWithoutJson(response, 204))
    .catch(handleError);
};

export const banUser = (variables: {
  token: string;
  bannedUserId: number;
}): Promise<string | void> => {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/users/ban/${variables.bannedUserId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${variables.token}`,
    },
  })
    .then((response) => handleResponseWithoutJson(response, 204))
    .catch(handleError);
};

export const followUser = (variables: {
  followedId: number;
  token: string;
}): Promise<string | void> => {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/users/follow/${variables.followedId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${variables.token}`,
    },
  })
    .then((response) => handleResponseWithoutJson(response, 204))
    .catch(handleError);
};
