import { getMem } from '@/serverApiCalls/mem';
import Modal from '@/utilComponents/RouteModal';
import MemDetailWrapper from '@/app/mem/[id]/(components)/mem/Mem';

export default async function page({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const { mem, sessionData } = await getMem(params.id);

  return (
    <Modal>
      <MemDetailWrapper mem={mem} sessionData={sessionData} />
    </Modal>
  );
}
