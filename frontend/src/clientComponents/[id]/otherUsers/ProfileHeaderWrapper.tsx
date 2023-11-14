'use client';

import ProfileHeader from './ProfileHeader';
import { JWT } from 'next-auth/jwt';
import { UserData } from '@/app/user/[id]/page';
import QueryProvider from '@/lib/reactQuery/QueryProvider';

export default function ProfileHeaderWrapper({
  user,
  sessionData,
}: {
  user: UserData;
  sessionData: JWT | null;
}) {
  return (
    <QueryProvider>
      <ProfileHeader user={user} sessionData={sessionData} />
    </QueryProvider>
  );
}
