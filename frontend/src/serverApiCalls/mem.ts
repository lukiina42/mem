import { Mem } from '@/types/mem';
import { getSession } from '@/lib/session';

export const getMem = async (id: number) => {
  const sessionData = await getSession();

  if (!sessionData) {
    throw new Error('User is not logged in');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/mems/${id}?requestingUserId=${
      sessionData ? sessionData.user.id : 0
    }`,
    {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    }
  );
  if (response.status !== 200) {
    throw new Error(`The fetch wasn't successful ${response.status}`);
  }

  const mem: Mem = await response.json();

  return {
    mem,
    sessionData,
  };
};
