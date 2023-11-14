'use client';

import { signOut } from 'next-auth/react';

export default function SignOut() {
  return (
    <button className="basic-button w-[16rem]" onClick={() => signOut({ callbackUrl: '/' })}>
      Sign Out and start over :0
    </button>
  );
}
