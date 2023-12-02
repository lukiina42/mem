import { getMem } from '@/serverApiCalls/mem';
import MemDetailWrapper from "@/app/mem/[id]/(components)/mem/Mem";

export default async function page({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const { mem, sessionData } = await getMem(params.id);

  return (
    <div className="w-full h-full justify-center items-center flex-col gap-1">
      <div className="border-b h-8 items-center pl-2 text-xl font-bold">Mem detail</div>
      <MemDetailWrapper mem={mem} sessionData={sessionData} />
    </div>
  );
}
