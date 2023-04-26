"use client";

import { Mem } from "@/types/mem";
import { User } from "next-auth";
import { useState } from "react";
import MemComments from "./commentsModal/MemComments";
import MemItem from "./MemItem";

interface MemItemInterface {
  mem: Mem;
  user: User | undefined;
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
  const [heartChanged, setHeartChanged] = useState(false);

  const isHearted = !heartChanged
    ? mem.heartedByCurrentUser
    : !mem.heartedByCurrentUser;

  const amountOfHearts = !heartChanged
    ? mem.heartedBy.length
    : mem.heartedByCurrentUser
    ? mem.heartedBy.length - 1
    : mem.heartedBy.length + 1;

  const handleHeartClick = (id: number) => {
    setHeartChanged(!heartChanged);
    handleHeartMemRequest(id);
  };

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
        <MemComments
          isHearted={isHearted}
          amountOfHearts={amountOfHearts}
          mem={mem}
          handleHeartClick={handleHeartClick}
          closeModal={() => setCommentsModalOpen(false)}
          isOwnedByCurrentUser={isOwnedByCurrentUser}
          handleDeleteMemClick={handleDeleteMemClick}
          user={user}
        />
      )}
    </div>
  );
}
