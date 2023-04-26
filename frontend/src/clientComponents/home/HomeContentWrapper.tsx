"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/lib/queryClient";
import { ToastContainer } from "react-toastify";
import { Mem } from "@/types/mem";

import HomeContent from "./HomeContent";
import { DefaultHomeProps } from "@/app/home/page";

export default function HomeContentWrapper({
  mems,
  sessionToken,
  isUserFollowingAnyone,
}: DefaultHomeProps) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <HomeContent
          mems={mems}
          sessionToken={sessionToken}
          isUserFollowingAnyone={isUserFollowingAnyone}
        />
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
