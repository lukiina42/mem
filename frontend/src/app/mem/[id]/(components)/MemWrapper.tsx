"use client";

import { queryClient } from "@/lib/queryClient";
import { Mem } from "@/types/mem";
import { QueryClientProvider } from "react-query";
import MemDetailWrapper from "./mem/Mem";
import { JWT } from "next-auth/jwt";

interface MemDetailWrapperProps {
  mem: Mem;
  sessionData: JWT | null;
}

export default function MemWrapper(props: MemDetailWrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemDetailWrapper mem={props.mem} sessionData={props.sessionData} />
    </QueryClientProvider>
  );
}
