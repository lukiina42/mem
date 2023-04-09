import ProfileContentWrapper from "@/components/[profileId]/ProfileContentWrapper";
import { User } from "@/types";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

async function getProfile(userId: number): Promise<User> {
  const jwtObject = await decode({
    token: cookies().get("next-auth.session-token")?.value,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const id = jwtObject?.sub;

  const userResponse = await fetch(`http://localhost:8080/users/${userId}`, {
    next: { revalidate: 0 },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (userResponse.status !== 200)
    throw new Error("The profile fetch wasn't successful");
  const userData = await userResponse.json();

  let memsFetchUrl = `http://localhost:8080/mems/user/${userId}`;
  memsFetchUrl += id ? `?requestingUser=${id}` : "";

  const memsResponse = await fetch(memsFetchUrl, {
    next: { revalidate: 0 },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (memsResponse.status !== 200)
    throw new Error("The user mems fetch wasn't successful");

  userData.mems = await memsResponse.json();

  return userData;
}

export default async function profile({ params }: { params: { id: number } }) {
  const user = await getProfile(params.id);

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto">
      <div className="h-16 w-full flex items-center border-b-2">
        <div className="font-bold text-xl ml-4">
          {user.username}&apos;s mems
        </div>
      </div>
      <div className="grow">
        <ProfileContentWrapper mems={user.mems} />
      </div>
    </div>
  );
}
