"use client";

import { SessionProvider } from "next-auth/react";
import SidebarLinks from "./SidebarLinks";
import { Session } from "next-auth";

export default function HeaderWrapper({
  userData,
}: {
  userData: Session | null;
}) {
  return (
    <SessionProvider>
      <SidebarLinks userData={userData} />
    </SessionProvider>
  );
}
