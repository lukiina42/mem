"use client";

import { queryClient } from "@/lib/queryClient";
import { SlUserFollow } from "react-icons/sl";
import { QueryClientProvider } from "react-query";
import ProfileHeader from "./ProfileHeader";
import { SessionProvider } from "next-auth/react";

export default function ProfileHeaderWrapper({
  username,
  id,
}: {
  username: string;
  id: number;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ProfileHeader username={username} id={id} />
      </SessionProvider>
    </QueryClientProvider>
  );
}
