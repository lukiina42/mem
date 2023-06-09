"use client";

import React, { useEffect } from "react";
import { MdOutlinePersonOutline } from "react-icons/md";
import ProfileOptionsMenu from "./profileOptionsMenu/ProfileOptionsMenu";
import FormsWrapper from "./forms/FormsWrapper";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { useSelectedLayoutSegment } from "next/navigation";

export default function Profile() {
  const [showModal, setShowModal] = React.useState<"none" | "signup" | "login">(
    "none"
  );
  const [showMenu, setShowMenu] = React.useState(false);

  const segment = useSelectedLayoutSegment();

  const { data: session, status } = useSession();

  //jwt is invalid (unable to signOut in middleware)
  useEffect(() => {
    if (!segment && session?.user?.name) {
      signOut();
    }
  }, [segment, session]);

  const resetMenu = () => {
    setShowModal("none");
    setShowMenu(false);
  };

  const signUpToLoginChange = () => setShowModal("login");

  const router = useRouter();

  const username = session?.user?.name ? session.user.name : "";

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
              !username && "hidden"
            }`}
          >
            {username}
          </span>
        </div>
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
              <ProfileOptionsMenu
                setShowModal={setShowModal}
                setShowMenu={setShowMenu}
                user={null}
              />
            )}
          </>
        ) : (
          <>
            {showMenu && (
              <ProfileOptionsMenu
                signOut={signOut}
                user={session.user}
                setShowModal={setShowModal}
                redirect={router.push}
                setShowMenu={setShowMenu}
              />
            )}
          </>
        )}
      </div>
      {status !== "authenticated" && (
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
      )}
    </>
  );
}
