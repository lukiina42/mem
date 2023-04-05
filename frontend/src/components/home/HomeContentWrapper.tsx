"use client";

import { SessionProvider } from "next-auth/react";
import NewTweetForm from "./newTweetForm/NewTweetForm";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/lib/queryClient";
import { ToastContainer } from "react-toastify";
import { Mem } from "@/types";
import { CgProfile } from "react-icons/cg";

export default function HomeContentWrapper({ mems }: { mems: Mem[] }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <div className="w-full flex flex-col">
          <NewTweetForm />
        </div>
        <div className="w-full flex flex-col justify-center items-center pb-b">
          {mems.map((mem) => {
            return (
              <div key={mem.id} className="w-full flex mt-3 pb-3 border-b">
                <div className="min-w-[4rem] flex justify-center mt-2">
                  <CgProfile
                    size={40}
                    className="rounded-full bg-gray-400 p-1 text-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-1 grow">
                  <div className="font-bold text-lg">{mem.owner.username}</div>
                  <div>{mem.content}</div>
                  <img // eslint-disable-line @next/next/no-img-element
                    src={mem.imageUrl}
                    alt="Some mem idk"
                  />
                  <div className="w-full h-12 bg-slate-200"></div>
                </div>
              </div>
            );
          })}
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
