'use client';

import { logout } from '@/clientApiCalls/logout';
import { useRouter } from 'next/navigation';

export default function SignOut() {
  const router = useRouter();
  return (
    <button
      className="basic-button w-[16rem]"
      onClick={async () => {
        await logout();
        router.push('/login');
      }}
    >
      Sign Out and start over :0
    </button>
  );
}
