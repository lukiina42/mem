'use client';

import LoggedUserInfo from './userInfo/UserInfo';
import { UserData } from '@/app/user/[id]/page';
import QueryProvider from '@/lib/reactQuery/QueryProvider';

export default function LoggedUserInfoWrapper({
  user,
  revalidate,
}: {
  user: UserData;
  revalidate: () => void;
}) {
  return (
    <div className="w-full flex flex-col items-center border-b-2">
      <div className="w-full h-12 flex items-center border-b-2">
        <div className="ml-4 text-lg font-bold">Your profile info</div>
      </div>
      <QueryProvider>
        <LoggedUserInfo user={user} revalidate={revalidate} />
      </QueryProvider>
    </div>
  );
}
