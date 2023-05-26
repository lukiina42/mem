"use client";

import { queryClient } from "@/lib/queryClient";
import { Notification } from "@/types/notification";
import { QueryClientProvider, useQuery } from "react-query";
import ViewMemButton from "./ViewMemButton";
import { JWT } from "next-auth/jwt";

export default function ViewMemButtonWrapper({
  notification,
  sessionData,
}: {
  notification: Notification;
  sessionData: JWT;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ViewMemButton sessionData={sessionData} notification={notification} />
    </QueryClientProvider>
  );
}
