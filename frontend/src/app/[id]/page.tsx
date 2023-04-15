import ProfileMemsWrapper from "@/clientComponents/[id]/profileMems/ProfileContentWrapper";
import UserInfoWrapper from "@/clientComponents/[id]/currentUser/userInfoWrapper/UserInfoWrapper";
import { User } from "@/types/user";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";
import ProfileHeaderWrapper from "@/clientComponents/[id]/otherUsers/ProfileHeaderWrapper";

interface GetProfileCallResponse {
  user: User;
  isLoggedInUser: boolean;
}

async function getProfile(userId: number): Promise<GetProfileCallResponse> {
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

  return {
    user: userData,
    isLoggedInUser: id ? parseInt(id) == userId : false,
  };
}

export default async function profile({ params }: { params: { id: number } }) {
  const getProfileResponse = await getProfile(params.id);
  const { user, isLoggedInUser } = getProfileResponse;

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto">
      {isLoggedInUser ? (
        <UserInfoWrapper user={user} />
      ) : (
        <ProfileHeaderWrapper username={user.username} id={user.id} />
      )}

      <div className="grow">
        <ProfileMemsWrapper mems={user.mems} isLoggedInUser={isLoggedInUser} />
      </div>
    </div>
  );
}
