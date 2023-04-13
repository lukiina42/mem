"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/lib/queryClient";
import { ToastContainer } from "react-toastify";
import { Mem } from "@/types";
import MemsContainer from "@/components/home/memsContainer/MemsContainer";

export default function ProfileMemsWrapper({
  mems,
  isLoggedInUser,
}: {
  mems: Mem[];
  isLoggedInUser: boolean;
}) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {isLoggedInUser && (
          <div className="font-bold flex flex-col bg-white ml-4 mt-4">
            Your mem's:
          </div>
        )}

        <div className="w-full flex flex-col justify-center items-center pb-b">
          <MemsContainer mems={mems} />
        </div>
      </QueryClientProvider>
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
    </SessionProvider>
  );
}
