"use client";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

import HomeContent from "./HomeContent";
import { DefaultHomeProps } from "@/app/home/page";
import QueryProvider from "@/lib/reactQuery/QueryProvider";

export default function HomeContentWrapper({
  mems,
  sessionData,
  isUserFollowingAnyone,
}: DefaultHomeProps) {
  return (
    <SessionProvider>
      <QueryProvider>
        <HomeContent
          mems={mems}
          sessionData={sessionData}
          isUserFollowingAnyone={isUserFollowingAnyone}
        />
      </QueryProvider>
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
