"use client";

import { ContextInterface } from "@/auth/AuthProvider";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { QueryClient, QueryClientProvider } from "react-query";

interface FormsWrapperProps {
  resetMenu: () => void;
  auth: ContextInterface;
  showModal: "none" | "signup" | "login";
}

const queryClient = new QueryClient();

export default function FormsWrapper(props: FormsWrapperProps) {
  const { resetMenu, auth, showModal } = props;
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <QueryClientProvider client={queryClient}>
            {showModal === "signup" ? (
              <SignupForm resetMenu={resetMenu} auth={auth} />
            ) : (
              <LoginForm resetMenu={resetMenu} auth={auth} />
            )}
          </QueryClientProvider>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
