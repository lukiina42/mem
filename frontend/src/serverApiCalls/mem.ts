import { Mem } from '@/types/mem';
import { retrieveCookiesSession } from './retrieveCookiesSession';

export const getMem = async (id: number) => {
  const sessionData = await retrieveCookiesSession();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/mems/${id}?requestingUserId=${sessionData ? sessionData.sub : 0}`,
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
