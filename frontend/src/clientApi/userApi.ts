import { User } from "@/types";
import {
  handleError,
  handleResponseWithoutJson,
  handleResponseWithJson,
} from "./apiUtils";

export const createUser = (variables: {
  email: string;
  password: string;
  username: string;
}): Promise<string | void> => {
  return fetch(`http://localhost:8080/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  return fetch(`http://localhost:8080/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  return fetch(`http://localhost:8080/users/${variables.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => handleResponseWithJson(response, 200))
    .catch(handleError);
};
