"use client";

import { SessionProvider } from "next-auth/react";
import NewTweetForm from "./newTweetForm/NewTweetForm";
import { QueryClient, QueryClientProvider } from "react-query";
import { queryClient } from "@/lib/queryClient";

export default function HomeContentWrapper() {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <div className="w-full flex flex-col">
          <NewTweetForm />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
}
