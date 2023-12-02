import { Mem } from '@/types/mem';
import { retrieveCookiesSession } from './retrieveCookiesSession';
import { JWT } from 'next-auth/jwt';

export const retrieveHomeMems = async () => {
  const sessionData = await retrieveCookiesSession();

  console.log(sessionData);

  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/mems?from=0&to=9`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionData?.token}`,
    },
    next: { revalidate: 0, tags: ['mems'] },
  });
  if (response.status !== 200) {
    throw new Error(`The fetch wasn't successful ${response.status}`);
  }

  const { mems, isUserFollowingAnyone }: { mems: Mem[]; isUserFollowingAnyone: boolean } =
    await response.json();

  return {
    mems,
    isUserFollowingAnyone,
    sessionData: sessionData as JWT,
  };
};
