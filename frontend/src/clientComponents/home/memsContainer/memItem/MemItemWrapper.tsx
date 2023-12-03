'use client';

import { Mem } from '@/types/mem';
import MemItem from './MemItem';
import { useHeart } from '@/hooks/useHeart';
import { SessionUser } from '@/app/api/login/route';

interface MemItemInterface {
  mem: Mem;
  sessionData: SessionUser;
  handleDeleteMemClick: (id: number) => void;
  displayBorder: boolean;
  handleHeartMemRequest: (memId: number) => void;
  enableDelete?: boolean;
}

export default function MemItemWrapper({
  mem,
  sessionData,
  handleDeleteMemClick,
  displayBorder,
  handleHeartMemRequest,
  enableDelete,
}: MemItemInterface) {
  const { handleHeartClick, isHearted, amountOfHearts } = useHeart(
    mem.heartedByCurrentUser,
    mem.heartedBy,
    handleHeartMemRequest
  );

  const isOwnedByCurrentUser = sessionData?.user.username === mem.owner.username;

  return (
    <div className={`w-full flex mt-3 mr-1 pb-3 pr-2 ${displayBorder && 'border-b'}`}>
      <MemItem
        key={mem.id}
        mem={mem}
        handleDeleteMemClick={handleDeleteMemClick}
        handleHeartClick={handleHeartClick}
        isHearted={isHearted}
        amountOfHearts={amountOfHearts}
        isOwnedByCurrentUser={isOwnedByCurrentUser}
        enableDelete={enableDelete}
      />
    </div>
  );
}
