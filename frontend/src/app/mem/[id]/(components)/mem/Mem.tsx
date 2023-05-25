"use client";

import { useHeartMutation } from "@/clientApiCalls/reactQuery/heartMutation";
import MemDetail from "@/clientComponents/home/memsContainer/memItem/commentsModal/MemDetail";
import { useHeart } from "@/hooks/useHeart";
import { Mem } from "@/types/mem";
import ModalWrapper from "@/utilComponents/ModalWrapper";
import { JWT } from "next-auth/jwt";

interface MemDetailWrapperProps {
  mem: Mem;
  sessionData: JWT | null;
}

export default function MemDetailWrapper(props: MemDetailWrapperProps) {
  const { mem, sessionData } = props;

  const heartMemMutation = useHeartMutation();

  const handleHeartMemRequest = (memId: number) => {
    heartMemMutation.mutate({ memId, token: sessionData?.token! });
  };

  const { handleHeartClick, isHearted, amountOfHearts } = useHeart(
    mem.heartedByCurrentUser || false,
    mem.heartedBy || [],
    handleHeartMemRequest
  );

  return (
    <MemDetail
      mem={mem}
      token={sessionData ? sessionData.token : ""}
      isHearted={isHearted}
      amountOfHearts={amountOfHearts}
      handleHeartClick={handleHeartClick}
      handleDeleteMemClick={() => {}}
      isOwnedByCurrentUser={sessionData?.name == mem.owner.username}
      imgMaxH={480}
    />
  );
}
