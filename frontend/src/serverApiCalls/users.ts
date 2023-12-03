import { PotentialFriend } from '@/types/user';
import { getSession } from '@/lib/session';

export const getPotentialFriends = async () => {
  const sessionData = await getSession();

  if (!sessionData) {
    throw new Error('User is not logged in');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/users/recommendation/potentialFriends`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionData?.token}`,
      },
    }
  );
  if (response.status !== 200) {
    throw new Error(`The fetch wasn't successful ${response.status}`);
  }

  const users: PotentialFriend[] = await response.json();

  return {
    users,
    sessionData,
  };
};
