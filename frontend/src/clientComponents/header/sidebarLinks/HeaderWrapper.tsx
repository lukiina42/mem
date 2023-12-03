'use client';

import SidebarLinks from './SidebarLinks';
import { useSelectedLayoutSegment } from 'next/navigation';
import { JWT } from 'next-auth/jwt';
import { SessionUser } from '@/app/api/login/route';

export default function HeaderWrapper({ userData }: { userData: SessionUser }) {
  const segment = useSelectedLayoutSegment();
  return (
    <>
      {
        segment != 'banned' && <SidebarLinks userData={userData} />
      }
    </>
  );
}
