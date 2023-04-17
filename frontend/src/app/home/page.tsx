import HomeContentWrapper from "@/clientComponents/home/HomeContentWrapper";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { Mem, MemDto } from "@/types/mem";

const getMems = async (): Promise<Mem[]> => {
  //getServerSession from next auth returns only name and email, even though in callbacks I have specified it should return the token and id as well
  const sessionData = await decode({
    token: cookies().get("next-auth.session-token")?.value,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const response = await fetch("http://localhost:8080/mems", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionData?.token}`,
    },
    next: { revalidate: 120 },
  });
  if (response.status !== 200) {
    console.log(response);
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

export default async function page() {
  const mems = await getMems();

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto">
      <div className="h-16 w-full flex items-center border-b-2">
        <div className="font-bold text-xl ml-4">Home</div>
      </div>
      <div className="grow">
        <HomeContentWrapper mems={mems} />
      </div>
    </div>
  );
}
