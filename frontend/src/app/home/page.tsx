import HomeContentWrapper from "@/components/home/HomeContentWrapper";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

const getMems = async () => {
  const jwtObject = await decode({
    token: cookies().get("next-auth.session-token")?.value,
    secret: process.env.NEXTAUTH_SECRET!,
  });
  const response = await fetch("http://localhost:8080/mems", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwtObject?.token}`,
    },
    next: { revalidate: 0 },
  });
  if (response.status !== 200) {
    throw new Error("The fetch wasn't successful");
  }
  return await response.json();
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
