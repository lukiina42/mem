"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import CustomLink from "../helper/CustomLink";
import { BsBookmarksFill, BsBookmarks } from "react-icons/bs";
import { HiBellAlert, HiOutlineBellAlert } from "react-icons/hi2";
import ProfileWrapper from "../profileSettings/ProfileWrapper";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { JWT } from "next-auth/jwt";

export default function SidebarLinks({ userData }: { userData: JWT | null }) {
  const segment = useSelectedLayoutSegment();

  const { notification, setNotification, notificationTrigger } =
    useNotificationSocket(userData);

  //TODO REVALIDATE NOTIFICATIONS PATH IF NEW NOTIFICATION APPEARS

  //the fact that user is logged in is secured in middleware
  return (
    <div className="flex flex-col gap-5 mt-4">
      {segment && (
        <>
          <div className="w-8 @[200px]:w-[95%] block mb-4 border self-end"></div>
          <CustomLink href={"/bookmarks"} name="Bookmarks" segment={segment}>
            {segment === "bookmarks" ? (
              <BsBookmarksFill size={30} />
            ) : (
              <BsBookmarks size={30} />
            )}
          </CustomLink>
          <CustomLink
            href={"/notifications"}
            name={notification ? notification : "Notifications"}
            segment={segment}
            hideTooltip={notificationTrigger}
          >
            <span
              className={`notification-tooltip origin-left scale-100 left-[100%] ${
                notificationTrigger ? "block" : "hidden"
              }`}
            >
              {notification}
            </span>
            {segment === "notifications" ? (
              <HiBellAlert size={30} />
            ) : (
              <div className="relative" onClick={() => setNotification("")}>
                <HiOutlineBellAlert
                  size={30}
                  className={`${notificationTrigger && "animate-wiggle"}`}
                />
                {notification && (
                  <div className="absolute bottom-0 right-1 bg-red-500 rounded-full w-1 h-1"></div>
                )}
              </div>
            )}
          </CustomLink>
        </>
      )}
      <div className="w-8 @[200px]:w-[95%] block mt-4 border self-end"></div>
      <ProfileWrapper />
    </div>
  );
}
