'use client';

import SidebarLinks from './SidebarLinks';
import { useSelectedLayoutSegment } from 'next/navigation';
import { JWT } from 'next-auth/jwt';

export default function HeaderWrapper({ userData }: { userData: JWT | null }) {
  const segment = useSelectedLayoutSegment();
  return <>{segment != 'banned' && <SidebarLinks userData={userData} />}</>;
}
