"use client";

import { User } from "@/types";
import { CgProfile } from "react-icons/cg";
import UserInfo from "./userInfo/UserInfo";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/lib/queryClient";
import { SessionProvider } from "next-auth/react";

export default function UserInfoWrapper({ user }: { user: User }) {
  return (
    <div className="w-full flex flex-col items-center border-b-2">
      <div className="w-full h-12 flex items-center border-b-2">
        <div className="ml-4 text-lg font-bold">Profile info</div>
      </div>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <UserInfo user={user} />
        </SessionProvider>
      </QueryClientProvider>
    </div>
  );
}
