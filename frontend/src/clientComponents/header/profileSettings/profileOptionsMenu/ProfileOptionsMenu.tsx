'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SessionUser } from '@/app/api/login/route';
import { logout } from '@/clientApiCalls/logout';

export default function ProfileOptionsMenu({
  setShowMenu,
  userData,
}: {
  setShowMenu?: (i: boolean) => void;
  signedIn?: boolean;
  userData: SessionUser | null;
}) {
  const signedIn = userData !== null;

  const router = useRouter();

  return (
    <div
      className={`absolute -top-[80%] left-[105%] bg-base-100 w-56 border-[2px] bg-white border-slate-200 shadow-lg rounded-lg flex flex-col justify-evenly`}
    >
      {!signedIn ? (
        <>
          <Link href={{ pathname: `/signup` }}>
            <div
              onClick={() => {
                setShowMenu!(false);
              }}
              className="font-bold rounded-t-lg border-blue-500 w-full text-center hover:cursor-pointer hover:bg-blue-300 py-2 transition-all duration-200"
            >
              Sign up
            </div>
          </Link>
          <Link href={{ pathname: `/login` }}>
            <div
              className="font-bold rounded-b-lg w-full text-center hover:cursor-pointer hover:bg-blue-300 py-2"
              onClick={() => setShowMenu!(false)}
            >
              Log in
            </div>
          </Link>
        </>
      ) : (
        <>
          {userData?.user?.username?.length && userData.user?.username.length > 14 && (
            <div className="font-bold rounded-t-lg border-blue-500 w-full text-center py-2">
              {userData?.user?.username}
            </div>
          )}
          <Link
            href={{ pathname: `/user/${userData.user.id}` }}
            onClick={() => {
              setShowMenu!(false);
            }}
            className={`font-bold w-full text-center border-t ${
              userData?.user?.username?.length && userData.user?.username.length > 14
                ? 'border-t rounded-t-none'
                : 'rounded-t-lg border-none'
            } border-b hover:cursor-pointer hover:bg-blue-300 py-2 transition-all duration-200`}
          >
            Profile
          </Link>
          <div
            onClick={async () => {
              setShowMenu!(false);
              await logout();
              router.push('/login');
            }}
            className="font-bold rounded-b-lg w-full text-center hover:cursor-pointer hover:bg-blue-300 py-2 transition-all duration-200"
          >
            Log out
          </div>
        </>
      )}
    </div>
  );
}
