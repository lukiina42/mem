"use client";

import { SessionProvider } from "next-auth/react";
import SidebarLinks from "./SidebarLinks";

export default function SidebarLinksWrapper() {
  return (
    <SessionProvider>
      <SidebarLinks />
    </SessionProvider>
  );
}
