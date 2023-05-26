import HomeContentWrapper from "@/clientComponents/home/HomeContentWrapper";
import { Mem } from "@/types/mem";
import { retrieveHomeMems } from "@/serverApiCalls/home";
import { JWT } from "next-auth/jwt";

const getMems = async () => {
  return await retrieveHomeMems();
};

export interface DefaultHomeProps {
  mems: Mem[];
  sessionData: JWT;
  isUserFollowingAnyone: boolean;
}

export default async function page() {
  const { mems, sessionData, isUserFollowingAnyone } = await getMems();

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto">
      <div className="w-full border-b-2">
        <div className="h-16 flex items-center font-bold text-xl ml-4">
          Home
        </div>
      </div>
      <div className="grow">
        <HomeContentWrapper
          mems={mems}
          sessionData={sessionData}
          isUserFollowingAnyone={isUserFollowingAnyone}
        />
      </div>
    </div>
  );
}
