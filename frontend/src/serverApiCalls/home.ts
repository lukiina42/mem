import { Mem } from "@/types/mem";
import { retrieveCookiesSession } from "./retrieveCookiesSession";

export const retrieveHomeMems = async () => {
  const sessionData = await retrieveCookiesSession();

  const response = await fetch("http://localhost:8080/mems", {
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
    sessionToken: sessionData!.token,
  };
};
