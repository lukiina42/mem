"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import CustomLink from "../helper/CustomLink";
import { BsBookmarksFill, BsBookmarks } from "react-icons/bs";
import { HiBellAlert, HiOutlineBellAlert } from "react-icons/hi2";
import ProfileWrapper from "@/components/profileSettings/ProfileWrapper";

export default function SidebarLinks() {
  const segment = useSelectedLayoutSegment();

  //the fact that user is logged in is secured in middleware
  if (segment) {
    return (
      <div className="flex flex-col gap-5 mt-4">
        <div className="w-8 @[180px]:w-[95%] block mb-4 border self-end"></div>
        <CustomLink href={"/bookmarks"} name="Bookmarks" segment={segment}>
          {segment === "bookmarks" ? (
            <BsBookmarksFill size={30} />
          ) : (
            <BsBookmarks size={30} />
          )}
        </CustomLink>
        <CustomLink
          href={"/notifications"}
          name="Notifications"
          segment={segment}
        >
          {segment === "notifications" ? (
            <HiBellAlert size={30} />
          ) : (
            <HiOutlineBellAlert size={30} />
          )}
        </CustomLink>
        <div className="w-8 @[180px]:w-[95%] block mt-4 border self-end"></div>
        <ProfileWrapper />
      </div>
    );
  }

  return <></>;
}
