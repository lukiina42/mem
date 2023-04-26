import HomeContentWrapper from "@/clientComponents/home/HomeContentWrapper";
import { Mem } from "@/types/mem";
import { retrieveHomeMems } from "@/serverApiCalls/home";

const getMems = async () => {
  return await retrieveHomeMems();
};

export interface DefaultHomeProps {
  mems: Mem[];
  sessionToken: string;
  isUserFollowingAnyone: boolean;
}

export default async function page() {
  const { mems, sessionToken, isUserFollowingAnyone } = await getMems();

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto">
      <div className="h-16 w-full flex items-center border-b-2">
        <div className="font-bold text-xl ml-4">Home</div>
      </div>
      <div className="grow">
        <HomeContentWrapper
          mems={mems}
          sessionToken={sessionToken}
          isUserFollowingAnyone={isUserFollowingAnyone}
        />
      </div>
    </div>
  );
}
