import { Mem } from "@/types/mem";
import { retrieveCookiesSession } from "./retrieveCookiesSession";
import { JWT } from "next-auth/jwt";

export const retrieveHomeMems = async () => {
  const sessionData = await retrieveCookiesSession();

  const response = await fetch("http://localhost:8080/mems?from=0&to=9", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionData?.token}`,
    },
    next: { revalidate: 0 },
  });
  if (response.status !== 200) {
    throw new Error(`The fetch wasn't successful ${response.status}`);
  }

  const {
    mems,
    isUserFollowingAnyone,
  }: { mems: Mem[]; isUserFollowingAnyone: boolean } = await response.json();

  return {
    mems,
    isUserFollowingAnyone,
    sessionData: sessionData as JWT,
  };
};
