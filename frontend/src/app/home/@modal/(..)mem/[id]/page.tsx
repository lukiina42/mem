import { getMem } from "@/serverApiCalls/mem";
import MemWrapper from "@/app/mem/[id]/(components)/MemWrapper";
import Modal from "@/utilComponents/RouteModal";

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
      <MemWrapper mem={mem} sessionData={sessionData} />
    </Modal>
  );
}
