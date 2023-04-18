import { UserData, UserDataDto } from "@/app/[id]/page";
import { retrieveCookiesSession } from "./retrieveCookiesSession";

export const retrieveProfileInfo = async (userId: number) => {
  const sessionData = await retrieveCookiesSession();
  const loggedInUserId = sessionData?.sub;

  const userResponse = await fetch(`http://localhost:8080/users/${userId}`, {
    next: { revalidate: 120 },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (userResponse.status !== 200)
    throw new Error("The profile fetch wasn't successful");
  const userData: UserDataDto = await userResponse.json();

  const isFollowedByCurrentUser =
    loggedInUserId && userData.followedBy
      ? userData.followedBy.find(
          (user) => user.id === parseInt(loggedInUserId)
        ) !== undefined
      : false;

  delete userData.followedBy;

  const userDataDto: UserData = {
    ...userData,
    followedByCurrentUser: isFollowedByCurrentUser,
  };

  let memsFetchUrl = `http://localhost:8080/mems/user/${userId}`;
  memsFetchUrl += loggedInUserId ? `?requestingUser=${loggedInUserId}` : "";

  const memsResponse = await fetch(memsFetchUrl, {
    next: { revalidate: 120 },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (memsResponse.status !== 200)
    throw new Error("The user mems fetch wasn't successful");

  userDataDto.mems = await memsResponse.json();

  return {
    user: userDataDto,
    isLoggedInUser: loggedInUserId ? parseInt(loggedInUserId) == userId : false,
  };
};
