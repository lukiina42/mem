"use client";

import { queryClient } from "@/lib/reactQuery/queryClient";
import { Notification } from "@/types/notification";
import ViewMemButton from "./ViewMemButton";
import { JWT } from "next-auth/jwt";
import QueryProvider from "@/lib/reactQuery/QueryProvider";

export default function ViewMemButtonWrapper({
  notification,
  sessionData,
}: {
  notification: Notification;
  sessionData: JWT;
}) {
  return (
    <QueryProvider>
      <ViewMemButton sessionData={sessionData} notification={notification} />
    </QueryProvider>
  );
}
