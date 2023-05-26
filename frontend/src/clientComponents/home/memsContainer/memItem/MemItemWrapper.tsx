"use client";

import { Mem } from "@/types/mem";
import { User } from "next-auth";
import { useState } from "react";
import MemDetail from "./commentsModal/MemDetail";
import MemItem from "./MemItem";
import { useHeart } from "@/hooks/useHeart";
import ModalWrapper from "@/utilComponents/ModalWrapper";
import { JWT } from "next-auth/jwt";

interface MemItemInterface {
  mem: Mem;
  user: JWT | null;
  handleDeleteMemClick: (id: number) => void;
  displayBorder: boolean;
  handleHeartMemRequest: (memId: number) => void;
}

export default function MemItemWrapper({
  mem,
  user,
  handleDeleteMemClick,
  displayBorder,
  handleHeartMemRequest,
}: MemItemInterface) {
  const { handleHeartClick, isHearted, amountOfHearts } = useHeart(
    mem.heartedByCurrentUser,
    mem.heartedBy,
    handleHeartMemRequest
  );

  const isOwnedByCurrentUser = user?.name === mem.owner.username;

  const [commentsModalOpen, setCommentsModalOpen] = useState(false);

  return (
    <div
      className={`w-full flex mt-3 mr-1 pb-3 pr-2 ${
        displayBorder && "border-b"
      }`}
    >
      <MemItem
        key={mem.id}
        mem={mem}
        handleDeleteMemClick={handleDeleteMemClick}
        handleHeartClick={handleHeartClick}
        setCommentsModal={setCommentsModalOpen}
        isHearted={isHearted}
        amountOfHearts={amountOfHearts}
        isOwnedByCurrentUser={isOwnedByCurrentUser}
      />
      {commentsModalOpen && (
        <ModalWrapper closeModal={() => setCommentsModalOpen(false)}>
          <MemDetail
            isHearted={isHearted}
            amountOfHearts={amountOfHearts}
            mem={mem}
            handleHeartClick={handleHeartClick}
            isOwnedByCurrentUser={isOwnedByCurrentUser}
            handleDeleteMemClick={handleDeleteMemClick}
            token={user?.token ? user.token : ""}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
