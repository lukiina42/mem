"use client";

import { Mem } from "@/types/mem";
import MemDetailWrapper from "./mem/Mem";
import { JWT } from "next-auth/jwt";
import QueryProvider from "@/lib/reactQuery/QueryProvider";

interface MemDetailWrapperProps {
  mem: Mem;
  sessionData: JWT | null;
}

export default function MemWrapper(props: MemDetailWrapperProps) {
  return (
    <QueryProvider>
      <MemDetailWrapper mem={props.mem} sessionData={props.sessionData} />
    </QueryProvider>
  );
}
