import { Mem, MemDto } from "@/types/mem";
import { retrieveCookiesSession } from "./retrieveCookiesSession";

export const retrieveHomeMems = async () => {
  const sessionData = await retrieveCookiesSession();

  console.log(sessionData?.token);

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
  let memsBE: MemDto[] = await response.json();
  let mems: Mem[] = memsBE.map((mem) => {
    const createdTime = new Date(mem.createdDate);
    const updatedTime = new Date(mem.updatedDate);

    const time =
      createdTime.getTime() == updatedTime.getTime()
        ? createdTime
        : updatedTime;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    //todo use timeZone as a locale somehow
    const formatedTime = new Intl.DateTimeFormat("cs-CZ", {
      day: "numeric",
      month: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(time);
    return {
      ...mem,
      lastUpdated: formatedTime,
    };
  });
  return mems;
};
