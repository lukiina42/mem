"use client";

import React from "react";
import { CgProfile } from "react-icons/cg";
import ProfileOptionsMenu from "./profileOptionsMenu/ProfileOptionsMenu";
import FormsWrapper from "./forms/FormsWrapper";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ToastContainer } from "react-toastify";

export default function Profile() {
  const [showModal, setShowModal] = React.useState<"none" | "signup" | "login">(
    "none"
  );
  const [showMenu, setShowMenu] = React.useState(false);

  const { data: session, status } = useSession();

  const resetMenu = () => {
    setShowModal("none");
    setShowMenu(false);
  };

  const signUpToLoginChange = () => setShowModal("login");

  const router = useRouter();

  return (
    <>
      <div className="relative mb-5">
        <CgProfile
          size={50}
          className="text-blue-600 hover:cursor-pointer hover:bg-blue-200 rounded-full transition-all duration-200"
          onClick={() => setShowMenu((currMenu) => !currMenu)}
        />
        {!session?.user ? (
          <>
            {showModal !== "none" ? (
              <FormsWrapper
                resetMenu={resetMenu}
                showModal={showModal}
                redirect={router.push}
                signUpToLoginChange={signUpToLoginChange}
              />
            ) : null}
            {showMenu && (
              <div
                className={`absolute bottom-1/4 left-[150%] bg-base-100 w-56 border border-blue-500 rounded-lg flex flex-col justify-evenly`}
              >
                <ProfileOptionsMenu
                  setShowModal={setShowModal}
                  setShowMenu={setShowMenu}
                />
              </div>
            )}
          </>
        ) : (
          <>
            {showMenu && (
              <div
                className={`absolute bottom-1/4 left-[150%] bg-base-100 w-56 border border-blue-500 rounded-lg flex flex-col justify-evenly`}
              >
                <ProfileOptionsMenu
                  signOut={signOut}
                  signedIn
                  setShowModal={setShowModal}
                  redirect={router.push}
                  setShowMenu={setShowMenu}
                />
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
