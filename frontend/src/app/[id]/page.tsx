import ProfileMemsWrapper from "@/clientComponents/[id]/profileMems/ProfileContentWrapper";
import UserInfoWrapper from "@/clientComponents/[id]/currentUser/userInfoWrapper/UserInfoWrapper";
import { User } from "@/types/user";
import ProfileHeaderWrapper from "@/clientComponents/[id]/otherUsers/ProfileHeaderWrapper";
import { retrieveProfileInfo } from "@/serverApiCalls/[profileId]";

interface GetProfileCallResponse {
  user: UserData;
  isLoggedInUser: boolean;
}

export interface UserDataDto extends User {
  followedBy?: User[];
}

export interface UserData extends User {
  followedByCurrentUser: boolean;
}

async function getProfile(userId: number): Promise<GetProfileCallResponse> {
  return await retrieveProfileInfo(userId);
}

export default async function profile({ params }: { params: { id: number } }) {
  const getProfileResponse = await getProfile(params.id);
  const { user, isLoggedInUser } = getProfileResponse;

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto">
      {isLoggedInUser ? (
        <UserInfoWrapper user={user} />
      ) : (
        <ProfileHeaderWrapper
          username={user.username}
          id={user.id}
          isFollowedByCurrentUser={user.followedByCurrentUser}
        />
      )}

      <div className="grow">
        <ProfileMemsWrapper mems={user.mems} isLoggedInUser={isLoggedInUser} />
      </div>
    </div>
  );
}
