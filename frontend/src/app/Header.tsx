import Link from 'next/link';
import React from 'react';
import HeaderWrapper from '@/clientComponents/header/sidebarLinks/HeaderWrapper';
import { JWT } from 'next-auth/jwt';
import ProfileWrapper from '@/clientComponents/header/profileSettings/ProfileWrapper';

export default function Header({ userData }: { userData: JWT | null }) {
  return (
    <>
      <nav className="grow shadow-xl max-h-full flex flex-col justify-start items-end @container min-w-[64px] gap-12">
        <div className="flex flex-col gap-5 mt-5">
          <Link href="/home">
            <div className="ml-4 w-full flex justify-center">
              <div className="relative @[200px]:h-[64px] @[200px]:w-[64px] w-[50px] h-[50px] mr-4">
                <img // eslint-disable-line @next/next/no-img-element
                  src="/logo.png"
                  className="w-full"
                  alt="logo"
                />
              </div>
            </div>
          </Link>
          <div className="mr-5 flex flex-col gap-4">
            {userData !== null && <HeaderWrapper userData={userData} />}
            <ProfileWrapper />
          </div>
        </div>
      </nav>
    </>
  );
}
