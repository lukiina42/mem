"use client";

import { queryClient } from "@/lib/queryClient";
import LoginForm from "./login/LoginForm";
import SignupForm from "./signup/SignupForm";
import { QueryClientProvider } from "react-query";
import ModalWrapper from "@/utilComponents/ModalWrapper";

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
        <QueryClientProvider client={queryClient}>
          {showModal === "signup" ? (
            <SignupForm
              resetMenu={resetMenu}
              signUpToLoginChange={signUpToLoginChange}
            />
          ) : (
            <LoginForm resetMenu={resetMenu} redirect={redirect} />
          )}
        </QueryClientProvider>
      </ModalWrapper>
    </>
  );
}
