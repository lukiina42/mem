"use client";

import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "react-query";
import ProfileHeader from "./ProfileHeader";
import { JWT } from "next-auth/jwt";
import { UserData } from "@/app/user/[id]/page";

export default function ProfileHeaderWrapper({
  user,
  sessionData,
}: {
  user: UserData;
  sessionData: JWT | null;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileHeader user={user} sessionData={sessionData} />
    </QueryClientProvider>
  );
}
