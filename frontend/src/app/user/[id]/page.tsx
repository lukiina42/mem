import ProfileMemsWrapper from '@/clientComponents/[id]/profileMems/ProfileContentWrapper';
import LoggedUserInfoWrapper from '@/clientComponents/[id]/currentUser/userInfoWrapper/UserInfoWrapper';
import { User } from '@/types/user';
import { retrieveProfileInfo } from '@/serverApiCalls/[profileId]';
import { revalidateUser } from '@/app/actions';
import ProfileHeader from '@/clientComponents/[id]/otherUsers/ProfileHeader';

export interface UserDataDto extends User {
  followedBy?: User[];
}

export interface UserData extends User {
  followedByCurrentUser: boolean;
}

export default async function profile({ params }: { params: { id: number } }) {
  const getProfileResponse = await retrieveProfileInfo(params.id);
  const { user, isLoggedInUser, sessionData } = getProfileResponse;

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto">
      {isLoggedInUser ? (
        <LoggedUserInfoWrapper user={user} sessionData={sessionData} revalidate={revalidateUser} />
      ) : (
        <ProfileHeader user={user} sessionData={sessionData} />
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
