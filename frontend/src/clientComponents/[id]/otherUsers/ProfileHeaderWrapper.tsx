"use client";

import { queryClient } from "@/lib/queryClient";
import { SlUserFollow } from "react-icons/sl";
import { QueryClientProvider } from "react-query";
import ProfileHeader from "./ProfileHeader";
import { SessionProvider } from "next-auth/react";

export default function ProfileHeaderWrapper({
  username,
  id,
  isFollowedByCurrentUser,
}: {
  username: string;
  id: number;
  isFollowedByCurrentUser: boolean;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ProfileHeader
          username={username}
          id={id}
          isFollowedByCurrentUser={isFollowedByCurrentUser}
        />
      </SessionProvider>
    </QueryClientProvider>
  );
}
