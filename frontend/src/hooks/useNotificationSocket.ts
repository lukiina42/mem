import { Notification } from "@/types/notification";
import { Session } from "next-auth";
import { useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";

let socket: Socket | undefined = undefined;

export function useNotificationSocket(userData: Session | null) {
  const [isConnected, setIsConnected] = useState(false);
  const [notificationTrigger, setNotificationTrigger] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function handleNotification(notification: Notification) {
      setNotificationTrigger(true);
      setTimeout(() => setNotificationTrigger(false), 5000);
      setNotification(notification.content);
    }

    if (userData?.user) {
      if (!socket) {
        socket = io("http://localhost:8080", {
          query: { userId: userData.user.id },
        });
      }
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("heartedMem", handleNotification);
      socket.on("unheartedMem", handleNotification);
      socket.on("newFollow", handleNotification);
      socket.on("newComment", handleNotification);
    }

    return () => {
      if (userData?.user) {
        if (socket) {
          socket.off("connect", onConnect);
          socket.off("disconnect", onDisconnect);
          socket.off("heartedMem", handleNotification);
          socket.off("unheartedMem", handleNotification);
          socket.off("newFollow", handleNotification);
          socket.off("newComment", handleNotification);
        }
      }
    };
  }, [userData]);

  return { notification, setNotification, notificationTrigger };
}
