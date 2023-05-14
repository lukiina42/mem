"use client";

import { getMem } from "@/clientApiCalls/memApi";
import { Notification } from "@/types/notification";
import { useQuery } from "react-query";
import { useState } from "react";
import MemDetail from "@/clientComponents/home/memsContainer/memItem/commentsModal/MemDetail";
import { useHeartMutation } from "@/clientApiCalls/reactQuery/heartMutation";
import { useHeart } from "@/hooks/useHeart";

export default function ViewMemButton({
  notification,
  token,
}: {
  notification: Notification;
  token: string;
}) {
  const {
    data: mem,
    refetch,
    isLoading,
  } = useQuery(`mem${notification.id}`, () =>
    getMem({ id: notification.relatesToMemId!, token })
  );

  const heartMemMutation = useHeartMutation();

  const handleHeartMemRequest = (memId: number) => {
    heartMemMutation.mutate({ memId, token: token });
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
        <MemDetail
          isHearted={isHearted}
          amountOfHearts={mem.heartedBy.length}
          mem={mem}
          closeModal={() => setDisplayMemDetail(false)}
          handleHeartClick={handleHeartClick}
          isOwnedByCurrentUser={false}
          handleDeleteMemClick={() => {}}
          token={token}
        />
      )}
    </div>
  );
}
