"use client";

import LoginForm from "./login/LoginForm";
import SignupForm from "./signup/SignupForm";
import ModalWrapper from "@/utilComponents/ModalWrapper";
import QueryProvider from "@/lib/reactQuery/QueryProvider";

interface FormsWrapperProps {
  resetMenu: () => void;
  showModal: "none" | "signup" | "login";
  redirect: (url: string) => void;
  signUpToLoginChange: () => void;
}

export default function FormsWrapper(props: FormsWrapperProps) {
  const { resetMenu, showModal, redirect, signUpToLoginChange } = props;
  return (
    <>
      <ModalWrapper closeModal={resetMenu}>
        {/*content*/}
        <QueryProvider>
          {showModal === "signup" ? (
            <SignupForm
              resetMenu={resetMenu}
              signUpToLoginChange={signUpToLoginChange}
            />
          ) : (
            <LoginForm resetMenu={resetMenu} redirect={redirect} />
          )}
        </QueryProvider>
      </ModalWrapper>
    </>
  );
}
