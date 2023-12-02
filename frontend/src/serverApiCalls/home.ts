import { Mem } from '@/types/mem';
import { retrieveCookiesSession } from './retrieveCookiesSession';
import { JWT } from 'next-auth/jwt';

export const retrieveHomeMems = async () => {
  const sessionData = await retrieveCookiesSession();

  const responseFollowing = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/mems?from=0&to=9`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionData?.token}`,
      },
      next: { revalidate: 0, tags: ['mems'] },
    }
  );
  if (responseFollowing.status !== 200) {
    throw new Error(`The fetch of mems following wasn't successful ${responseFollowing.status}`);
  }

  const result = await responseFollowing.json();

  const {
    mems: memsFollowing,
    isUserFollowingAnyone,
  }: { mems: Mem[]; isUserFollowingAnyone: boolean } = result;

  const responseNewest = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/mems/home/newest?from=0&to=9`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionData?.token}`,
        'Content-type': 'application/json',
      },
    }
  );

  if (responseNewest.status !== 200) {
    throw new Error(`The fetch of newest mems wasn't successful ${responseNewest.status}`);
  }

  const newestMems: Mem[] = await responseNewest.json();

  return {
    memsFollowing,
    newestMems,
    isUserFollowingAnyone,
    sessionData: sessionData as JWT,
  };
};
