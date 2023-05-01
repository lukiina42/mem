"use client";

import { SessionProvider, useSession } from "next-auth/react";
import SidebarLinks from "./SidebarLinks";

export default function HeaderWrapper() {
  return (
    <SessionProvider>
      <SidebarLinks />
    </SessionProvider>
  );
}
