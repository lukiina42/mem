"use client";

import { User } from "next-auth";

export default function ProfileOptionsMenu({
  setShowModal,
  signOut,
  redirect,
  setShowMenu,
  user,
}: {
  setShowModal(modal: "signup" | "login" | "none"): void;
  setShowMenu?: (i: boolean) => void;
  signedIn?: boolean;
  signOut?: () => void;
  redirect?: (url: string) => void;
  user: User | null;
}) {
  const signedIn = user !== null;

  return (
    <div
      className={`absolute -top-[80%] left-[105%] bg-base-100 w-56 border-[2px] bg-white border-slate-200 shadow-lg rounded-lg flex flex-col justify-evenly`}
    >
      {!signedIn ? (
        <>
          <div
            onClick={() => {
              setShowModal("signup");
              setShowMenu!(false);
            }}
            className="font-bold rounded-t-lg border-blue-500 w-full text-center hover:cursor-pointer hover:bg-blue-300 py-2 transition-all duration-200"
          >
            Sign up
          </div>
          <div
            onClick={() => {
              setShowModal("login");
              setShowMenu!(false);
            }}
            className="font-bold rounded-b-lg w-full text-center hover:cursor-pointer hover:bg-blue-300 py-2"
          >
            Log in
          </div>
        </>
      ) : (
        <>
          {user?.name?.length && user.name.length > 14 && (
            <div className="font-bold rounded-t-lg border-blue-500 w-full text-center py-2">
              {user?.name}
            </div>
          )}
          <div
            onClick={() => {
              redirect!(`/user/${user.id}`);
              setShowMenu!(false);
            }}
            className={`font-bold w-full text-center border-t ${
              user?.name?.length && user.name.length > 14
                ? "border-t rounded-t-none"
                : "rounded-t-lg border-none"
            } border-b hover:cursor-pointer hover:bg-blue-300 py-2 transition-all duration-200`}
          >
            Profile
          </div>
          <div
            onClick={() => {
              setShowMenu!(false);
              signOut!();
              redirect!("");
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
