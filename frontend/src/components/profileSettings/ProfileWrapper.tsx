"use client";

import { SessionProvider } from "next-auth/react";
import Profile from "./ProfileSettings";

export default function ProfileWrapper() {
  return (
    <SessionProvider>
      <Profile />
    </SessionProvider>
  );
}
