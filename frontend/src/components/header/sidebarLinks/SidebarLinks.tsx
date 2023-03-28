"use client";

import { useSession } from "next-auth/react";
import { useSelectedLayoutSegment } from "next/navigation";
import CustomLink from "../CustomLink";

export default function SidebarLinks() {
  const segment = useSelectedLayoutSegment();

  //the fact that user is logged in is secured in middleware
  if (segment) {
    return (
      <div className="flex flex-col gap-5 mr-5">
        <CustomLink href="/bookmarks">
          <div className="ml-4">Bookmarks</div>
        </CustomLink>
        <CustomLink href="/notifications">
          <div className="ml-4">Notifications</div>
        </CustomLink>
      </div>
    );
  }

  return <></>;
}
