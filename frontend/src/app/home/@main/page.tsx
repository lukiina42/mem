import { Mem } from '@/types/mem';
import { retrieveHomeMems } from '@/serverApiCalls/home';
import HomeContent from '@/clientComponents/home/HomeContent';
import { SessionUser } from '@/app/api/login/route';
import { revalidateMems } from '@/app/actions';

export interface DefaultHomeProps {
  memsFollowing: Mem[];
  newestMems: Mem[];
  sessionData: SessionUser;
  isUserFollowingAnyone: boolean;
  revalidateMems: () => Promise<void>
}

export default async function page() {
  const { memsFollowing, newestMems, sessionData, isUserFollowingAnyone } =
    await retrieveHomeMems();

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto pt-4 shadow-xl">
        <HomeContent
          memsFollowing={memsFollowing}
          newestMems={newestMems}
          sessionData={sessionData}
          isUserFollowingAnyone={isUserFollowingAnyone}
          revalidateMems={revalidateMems}
        />
    </div>
  );
}
