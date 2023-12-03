'use client';

import { getMem } from '@/clientApiCalls/memApi';
import { Notification } from '@/types/notification';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import MemDetail from '@/clientComponents/home/memsContainer/memItem/commentsModal/MemDetail';
import { useHeartMutation } from '@/clientApiCalls/reactQuery/heartMutation';
import { useHeart } from '@/hooks/useHeart';
import ModalWrapper from '@/utilComponents/ModalWrapper';
import { SessionUser } from '@/app/api/login/route';

export default function ViewMemButton({
  notification,
  sessionData,
}: {
  notification: Notification;
  sessionData: SessionUser;
}) {
  const { data: mem } = useQuery({
    queryKey: [`mem`, notification.id],
    queryFn: () =>
      getMem({
        id: notification.relatesToMemId!,
        token: sessionData.token,
        requestUserId: sessionData.user.id.toString(),
      }),
  });

  const heartMemMutation = useHeartMutation();

  const handleHeartMemRequest = (memId: number) => {
    heartMemMutation.mutate({ memId, token: sessionData.token });
  };

  const { handleHeartClick, isHearted, amountOfHearts } = useHeart(
    mem?.heartedByCurrentUser || false,
    mem?.heartedBy || [],
    handleHeartMemRequest
  );

  const [displayMemDetail, setDisplayMemDetail] = useState(false);

  return (
    <div className="w-full h-4 flex mt-1">
      <div
        className="flex gap-1 items-center text-gray-600 text-sm hover:underline hover:cursor-pointer"
        onClick={() => setDisplayMemDetail(true)}
      >
        View mem
      </div>
      {displayMemDetail && mem && (
        <ModalWrapper closeModal={() => setDisplayMemDetail(false)}>
          <MemDetail
            isHearted={isHearted}
            amountOfHearts={amountOfHearts}
            mem={mem}
            handleHeartClick={handleHeartClick}
            isOwnedByCurrentUser={false}
            handleDeleteMemClick={() => {}}
            token={sessionData.token}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
