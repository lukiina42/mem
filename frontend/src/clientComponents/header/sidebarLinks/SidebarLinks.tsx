"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import CustomLink from "../helper/CustomLink";
import { BsBookmarksFill, BsBookmarks } from "react-icons/bs";
import { HiBellAlert, HiOutlineBellAlert } from "react-icons/hi2";
import ProfileWrapper from "../profileSettings/ProfileWrapper";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

let socket: Socket | undefined = undefined;

export default function SidebarLinks() {
  const segment = useSelectedLayoutSegment();

  const userData = useSession();

  const [isConnected, setIsConnected] = useState(false);
  const [notificationEvents, setNotificationEvents] = useState<string[]>([]);
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function handleHeartMemNotification(notification: any) {
      console.log(notification);
    }

    if (userData.data?.user) {
      if (!socket) {
        socket = io("http://localhost:8080", {
          query: { userId: userData.data.user.id },
        });
      }
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("heartMem", handleHeartMemNotification);
    }

    return () => {
      if (userData.data?.user) {
        if (socket) {
          socket.off("connect", onConnect);
          socket.off("disconnect", onDisconnect);
          socket.off("heatMem", handleHeartMemNotification);
        }
      }
    };
  }, [userData]);

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
            name="Notifications"
            segment={segment}
          >
            {segment === "notifications" ? (
              <HiBellAlert size={30} />
            ) : (
              <HiOutlineBellAlert size={30} />
            )}
          </CustomLink>
        </>
      )}
      <div className="w-8 @[200px]:w-[95%] block mt-4 border self-end"></div>
      <ProfileWrapper />
    </div>
  );
}
