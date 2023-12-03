import { Mem } from '@/types/mem';
import { retrieveHomeMems } from '@/serverApiCalls/home';
import HomeContent from '@/clientComponents/home/HomeContent';
import { SessionUser } from '@/app/api/login/route';

export interface DefaultHomeProps {
  memsFollowing: Mem[];
  newestMems: Mem[];
  sessionData: SessionUser;
  isUserFollowingAnyone: boolean;
}

export default async function page() {
  const { memsFollowing, newestMems, sessionData, isUserFollowingAnyone } =
    await retrieveHomeMems();

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto">
      <div className="w-full border-b-2">
        <div className="h-16 flex items-center font-bold text-xl ml-4">Home</div>
      </div>
      <div className="grow">
        <HomeContent
          memsFollowing={memsFollowing}
          newestMems={newestMems}
          sessionData={sessionData}
          isUserFollowingAnyone={isUserFollowingAnyone}
        />
      </div>
    </div>
  );
}
