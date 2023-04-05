"use client";

import { SessionProvider } from "next-auth/react";
import NewTweetForm from "./newTweetForm/NewTweetForm";
import { QueryClient, QueryClientProvider } from "react-query";
import { queryClient } from "@/lib/queryClient";
import { ToastContainer } from "react-toastify";

export default function HomeContentWrapper() {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <div className="w-full flex flex-col">
          <NewTweetForm />
        </div>
      </QueryClientProvider>
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </SessionProvider>
  );
}
