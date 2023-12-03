'use client';

import React, { useEffect } from 'react';
import { MdOutlinePersonOutline } from 'react-icons/md';
import ProfileOptionsMenu from './profileOptionsMenu/ProfileOptionsMenu';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useSelectedLayoutSegment } from 'next/navigation';
import {SessionUser} from "@/app/api/login/route";

export default function Profile({ userData }: { userData: SessionUser | null }) {
  const [showMenu, setShowMenu] = React.useState(false);

  const segment = useSelectedLayoutSegment();

  //jwt is invalid (unable to signOut in middleware)
  useEffect(() => {
    if (!segment && userData?.user.username) {
      signOut({
        callbackUrl: '/signin',
      });
    }
  }, [segment, userData]);

  const resetMenu = () => {
    setShowMenu(false);
  };

  const router = useRouter();

  const username = userData?.user?.username ? userData.user.username : '';

  return (
    <>
      <div className="relative mt-4">
        <div
          className="relative ml-4 flex @[200px]:justify-between justify-end gap-2 hover:text-blue-500 hover:cursor-pointer transition-all duration-200 group"
          onClick={() => setShowMenu((currMenu) => !currMenu)}
        >
          <div className="text-xl @[200px]:block hidden max-w-[140px] overflow-hidden whitespace-nowrap text-ellipsis">
            {username}
          </div>
          <MdOutlinePersonOutline size={30} />
          <span
            className={`tooltip origin-left left-[4.5rem] -bottom-2 group-hover:scale-100 @[200px]:hidden block ${
              !username && 'hidden'
            }`}
          >
            {username}
          </span>
        </div>
        {showMenu &&
          !userData?.user ? (
            <ProfileOptionsMenu setShowMenu={setShowMenu} userData={null} />
        ) : (
          <>
            {showMenu && (
              <ProfileOptionsMenu
                signOut={() =>
                  signOut({
                    callbackUrl: '/signin',
                  })
                }
                userData={userData}
                redirect={router.push}
                setShowMenu={setShowMenu}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
