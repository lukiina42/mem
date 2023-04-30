"use client";

import { SessionProvider } from "next-auth/react";
import SidebarLinks from "./SidebarLinks";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { JWT } from "next-auth/jwt";
import { Socket } from "socket.io-client";
import { retrieveCookiesSession } from "@/serverApiCalls/retrieveCookiesSession";

let socket: Socket = io("http://localhost:8080", { query: { userId: 8 } });

export default function HeaderWrapper() {
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

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("heartMem", handleHeartMemNotification);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("heatMem", handleHeartMemNotification);
    };
  }, []);

  console.log(notificationEvents);
  return (
    <SessionProvider>
      {isConnected ? "connected" : "disconnected"}
      <SidebarLinks />
    </SessionProvider>
  );
}
