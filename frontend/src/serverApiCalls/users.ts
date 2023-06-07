import { retrieveCookiesSession } from "./retrieveCookiesSession";
import { User } from "@/types/user";

export const getPotentialFriends = async () => {
  const sessionData = await retrieveCookiesSession();

  console.log(sessionData?.token);

  const response = await fetch(`http://localhost:8080/users/potentialFriends`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionData?.token}`,
    },
  });
  if (response.status !== 200) {
    throw new Error(`The fetch wasn't successful ${response.status}`);
  }

  const users: User[] = await response.json();

  return {
    users,
    sessionData,
  };
};
