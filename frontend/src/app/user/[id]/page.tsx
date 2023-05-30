import ProfileMemsWrapper from "@/clientComponents/[id]/profileMems/ProfileContentWrapper";
import LoggedUserInfoWrapper from "@/clientComponents/[id]/currentUser/userInfoWrapper/UserInfoWrapper";
import { User } from "@/types/user";
import ProfileHeaderWrapper from "@/clientComponents/[id]/otherUsers/ProfileHeaderWrapper";
import { retrieveProfileInfo } from "@/serverApiCalls/[profileId]";

export interface UserDataDto extends User {
  followedBy?: User[];
}

export interface UserData extends User {
  followedByCurrentUser: boolean;
}

async function getProfile(userId: number) {
  return await retrieveProfileInfo(userId);
}

export default async function profile({ params }: { params: { id: number } }) {
  const getProfileResponse = await getProfile(params.id);
  const { user, isLoggedInUser, sessionData } = getProfileResponse;

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto">
      {isLoggedInUser ? (
        <LoggedUserInfoWrapper user={user} />
      ) : (
        <ProfileHeaderWrapper user={user} sessionData={sessionData} />
      )}

      <div className="grow">
        <ProfileMemsWrapper
          userId={user.id}
          mems={user.mems}
          isLoggedInUser={isLoggedInUser}
          sessionData={sessionData}
        />
      </div>
    </div>
  );
}
