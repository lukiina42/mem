"use client";

import React from "react";
import { CgProfile } from "react-icons/cg";
import ProfileOptionsMenu from "./ProfileOptionsMenu";
import { useAuth } from "@/auth/AuthProvider";
import FormsWrapper from "./FormsWrapper";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [showModal, setShowModal] = React.useState<"none" | "signup" | "login">(
    "none"
  );
  const [showMenu, setShowMenu] = React.useState(false);

  const resetMenu = () => {
    setShowModal("none");
    setShowMenu(false);
  };

  const auth = useAuth();

  const router = useRouter();

  return (
    <div className="relative mb-5">
      <CgProfile
        size={50}
        className="text-blue-600 hover:cursor-pointer hover:bg-blue-200 rounded-full transition-all duration-200"
        onClick={() => setShowMenu((currMenu) => !currMenu)}
      />
      {!auth.user ? (
        <>
          {showModal !== "none" ? (
            <FormsWrapper
              resetMenu={resetMenu}
              auth={auth}
              showModal={showModal}
            />
          ) : null}
          {showMenu && (
            <div
              className={`absolute bottom-1/4 left-[150%] bg-base-100 w-56 border border-blue-500 rounded-lg flex flex-col justify-evenly`}
            >
              <ProfileOptionsMenu setShowModal={setShowModal} />
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
                signOut={auth.signout}
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
  );
}
