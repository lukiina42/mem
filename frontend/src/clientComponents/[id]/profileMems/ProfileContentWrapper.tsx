import { Mem } from '@/types/mem';
import MemsContainer from '@/clientComponents/home/memsContainer/MemsContainer';
import { JWT } from 'next-auth/jwt';

export default function ProfileMemsWrapper({
  mems,
  userId,
  sessionData,
}: {
  mems: Mem[];
  isLoggedInUser: boolean;
  userId: number;
  sessionData: JWT | null;
}) {
  return (
    <>
        <div className="w-full flex flex-col justify-center items-center pb-b">
          <MemsContainer mems={mems} requestUrl={`/user/${userId}`} sessionData={sessionData} />
        </div>
    </>
  );
}
