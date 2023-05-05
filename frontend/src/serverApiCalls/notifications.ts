import { Notification } from "@/types/notification";
import { retrieveCookiesSession } from "./retrieveCookiesSession";

export const loadNotifications = async () => {
  const sessionData = await retrieveCookiesSession();

  if (!sessionData) {
    return {
      token: "",
      notifications: [],
    };
  }

  const response = await fetch("http://localhost:8080/notification", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionData?.token}`,
    },
    next: { revalidate: 0 },
  });
  if (response.status !== 200) {
    throw new Error(`The fetch wasn't successful ${response.status}`);
  }

  const notifications: Notification[] = await response.json();

  return { notifications: notifications, token: sessionData.token };
};
