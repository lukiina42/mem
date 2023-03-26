"use client";

import { AuthProvider } from "@/auth/AuthProvider";
import Profile from "./ProfileSettings";

export default function ProfileWrapper() {
  return (
    <AuthProvider>
      <Profile />
    </AuthProvider>
  );
}
