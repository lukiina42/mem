"use client";

import { SessionProvider } from "next-auth/react";
import NewMemForm from "./newMemForm/NewMemForm";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/lib/queryClient";
import { ToastContainer } from "react-toastify";
import { Mem } from "@/types/mem";
import MemsContainer from "./memsContainer/MemsContainer";

export default function HomeContentWrapper({ mems }: { mems: Mem[] }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <div className="w-full flex flex-col sticky bg-white top-0 border-b">
          <NewMemForm />
        </div>
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
