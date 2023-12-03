'use client';

import { useHeartMutation } from '@/clientApiCalls/reactQuery/heartMutation';
import MemDetail from '@/clientComponents/home/memsContainer/memItem/commentsModal/MemDetail';
import { useHeart } from '@/hooks/useHeart';
import { Mem } from '@/types/mem';
import { SessionUser } from '@/app/api/login/route';

interface MemDetailWrapperProps {
  mem: Mem;
  sessionData: SessionUser;
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
      token={sessionData.token}
      isHearted={isHearted}
      amountOfHearts={amountOfHearts}
      handleHeartClick={handleHeartClick}
      handleDeleteMemClick={() => {}}
      isOwnedByCurrentUser={sessionData.user.username == mem.owner.username}
      imgMaxH={360}
    />
  );
}
