"use client";

import { Mem } from "@/types/mem";
import { CgProfile } from "react-icons/cg";
import { BsFillTrashFill } from "react-icons/bs";
import { User } from "next-auth";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import React from "react";

interface MemItemInterface {
  mem: Mem;
  user: User | undefined;
  handleDeleteMemClick: (id: number) => void;
  displayBorder: boolean;
  handleHeartMem: (memId: number) => void;
}

export default function MemItem({
  mem,
  user,
  handleDeleteMemClick,
  displayBorder,
  handleHeartMem,
}: MemItemInterface) {
  const [heartChanged, setHeartChanged] = React.useState(false);

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
    handleHeartMem(id);
  };

  return (
    <div
      className={`w-full flex mt-3 pb-3 pr-2 ${displayBorder && "border-b"}`}
    >
      <div className="min-w-[4rem] flex justify-center mt-2">
        {mem.owner.avatarImageUrl ? (
          <img // eslint-disable-line @next/next/no-img-element
            className="w-[3.5rem] h-[3.5rem] rounded-full object-cover"
            alt="submitted picture"
            src={mem.owner.avatarImageUrl}
          />
        ) : (
          <CgProfile
            size={40}
            className="rounded-full bg-gray-400 p-1 text-gray-300"
          />
        )}
      </div>
      <div className="flex flex-col gap-1 grow">
        <div className="flex justify-between">
          <div className="font-bold text-lg">{mem.owner.username}</div>
          <div className="flex gap-2 items-center">
            <div className="text-sm">{mem.lastUpdated}</div>
            {user?.name === mem.owner.username && (
              <BsFillTrashFill
                size={30}
                className="text-red-500 p-1 rounded-full hover:bg-gray-200 duration-150 transition-all hover:cursor-pointer"
                onClick={() => handleDeleteMemClick(mem.id)}
              />
            )}
          </div>
        </div>
        <div>{mem.content}</div>
        {/* dunno if I should have some min w here, small pictures are kinda small ngl xd */}
        <img // eslint-disable-line @next/next/no-img-element
          src={mem.imageUrl}
          alt="Some mem idk"
          className="w-fit max-w-[100%]"
        />
        <div className="w-full h-8 flex mt-1">
          <div className="flex gap-1 items-center">
            {isHearted ? (
              <AiFillHeart
                size={30}
                className="text-red-400 hover:text-red-600 hover:cursor-pointer"
                onClick={() => handleHeartClick(mem.id)}
              />
            ) : (
              <AiOutlineHeart
                size={30}
                className="text-red-400 hover:text-red-600 hover:cursor-pointer"
                onClick={() => handleHeartClick(mem.id)}
              />
            )}
            <div className="font-bold text-xl">{amountOfHearts}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
