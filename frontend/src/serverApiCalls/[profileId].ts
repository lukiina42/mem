import { UserData, UserDataDto } from '@/app/user/[id]/page';
import { getSession } from '@/lib/session';

export const retrieveProfileInfo = async (userId: number) => {
  const sessionData = await getSession();

  if (!sessionData) {
    throw new Error('User is not logged in');
  }

  const loggedInUserId = sessionData.user.id;

  const userResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/users/${userId}`, {
    next: { revalidate: 0, tags: ['profile'] },
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (userResponse.status !== 200) throw new Error("The profile fetch wasn't successful");
  const userData: UserDataDto = await userResponse.json();

  const isFollowedByCurrentUser =
    loggedInUserId && userData.followedBy
      ? userData.followedBy.find((user) => user.id === loggedInUserId) !== undefined
      : false;

  delete userData.followedBy;

  const userDataDto: UserData = {
    ...userData,
    followedByCurrentUser: isFollowedByCurrentUser,
  };

  let memsFetchUrl = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/mems/user/${userId}?from=0&to=9`;
  memsFetchUrl += loggedInUserId ? `&requestingUser=${loggedInUserId}` : '';

  const memsResponse = await fetch(memsFetchUrl, {
    next: { revalidate: 0 },
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (memsResponse.status !== 200) throw new Error("The user mems fetch wasn't successful");

  userDataDto.mems = await memsResponse.json();

  return {
    user: userDataDto,
    isLoggedInUser: loggedInUserId ? loggedInUserId == userId : false,
    sessionData: sessionData,
  };
};
