"use client";

import LoginForm from "./login/LoginForm";
import SignupForm from "./signup/SignupForm";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";

interface FormsWrapperProps {
  resetMenu: () => void;
  showModal: "none" | "signup" | "login";
  redirect: (url: string) => void;
}

const queryClient = new QueryClient();

export default function FormsWrapper(props: FormsWrapperProps) {
  const { resetMenu, showModal, redirect } = props;
  return (
    <>
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
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <QueryClientProvider client={queryClient}>
            {showModal === "signup" ? (
              <SignupForm resetMenu={resetMenu} />
            ) : (
              <LoginForm resetMenu={resetMenu} redirect={redirect} />
            )}
          </QueryClientProvider>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
