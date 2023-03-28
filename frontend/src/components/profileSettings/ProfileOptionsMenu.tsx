"use client";

export default function ProfileOptionsMenu({
  setShowModal,
  signedIn,
  signOut,
  redirect,
  setShowMenu,
}: {
  setShowModal(modal: "signup" | "login" | "none"): void;
  setShowMenu?: (i: boolean) => void;
  signedIn?: boolean;
  signOut?: () => void;
  redirect?: (url: string) => void;
}) {
  return (
    <>
      {!signedIn ? (
        <>
          <div
            onClick={() => {
              setShowModal("signup");
              setShowMenu!(false);
            }}
            className="font-bold rounded-t-lg border-b border-blue-500 w-full text-center hover:cursor-pointer hover:bg-blue-300 py-2 transition-all duration-200"
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
          <div
            onClick={() => {
              signOut!();
              redirect!("");
            }}
            className="font-bold rounded-t-lg w-full text-center hover:cursor-pointer hover:bg-blue-300 py-2 transition-all duration-200"
          >
            Log out
          </div>
        </>
      )}
    </>
  );
}
