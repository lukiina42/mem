"use client";

import { getMem } from "@/clientApiCalls/memApi";
import { queryClient } from "@/lib/queryClient";
import { Notification } from "@/types/notification";
import { QueryClientProvider, useQuery } from "react-query";
import ViewMemButton from "./ViewMemButton";

export default function ViewMemButtonWrapper({
  notification,
  token,
}: {
  notification: Notification;
  token: string;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ViewMemButton token={token} notification={notification} />
    </QueryClientProvider>
  );
}
