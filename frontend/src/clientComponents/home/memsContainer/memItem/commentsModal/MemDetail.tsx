'use client';

import { getComments } from '@/clientApiCalls/commentApi';
import { Mem } from '@/types/mem';
import LoadingSpinner from '@/utilComponents/Loading';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MemItem from '../MemItem';
import RecursiveComment from './recursiveComment/RecursiveComment';
import NewCommentForm from './newCommentForm/NewCommentForm';
import { Comment } from '@/types/comment';
import CommentsWrapper
  from "@/clientComponents/home/memsContainer/memItem/commentsModal/commentsWrapper/CommentsWrapper";

interface MemCommentsProps {
  mem: Mem;
  isHearted: boolean;
  amountOfHearts: number;
  handleHeartClick: (memId: number) => void;
  isOwnedByCurrentUser: boolean;
  handleDeleteMemClick: (id: number) => void;
  token: string;
  imgMaxH?: number;
}

export default function MemDetail({
  mem,
  isHearted,
  amountOfHearts,
  handleHeartClick,
  handleDeleteMemClick,
  isOwnedByCurrentUser,
  token,
  imgMaxH,
}: MemCommentsProps) {
  return (
    <div className="h-[90vh] w-[80vw] min-w-[260px] min-h-[260px] max-w-[800px] bg-white flex rounded-lg">
      <div className="w-full flex flex-col gap-2 overflow-y-auto">
        <div className={`w-full flex mt-3 pb-3 pr-2 border-b`}>
          <MemItem
            key={mem.id}
            mem={mem}
            handleDeleteMemClick={handleDeleteMemClick}
            handleHeartClick={handleHeartClick}
            isHearted={isHearted}
            amountOfHearts={amountOfHearts}
            isOwnedByCurrentUser={isOwnedByCurrentUser}
            imgMaxH={imgMaxH || 480}
          />
        </div>
        <CommentsWrapper mem={mem} token={token} />
      </div>
    </div>
  );
}
