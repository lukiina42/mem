"use client";

import { Mem } from "@/types/mem";
import { CgProfile } from "react-icons/cg";
import { BsFillTrashFill } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";

interface MemItemInterface {
  mem: Mem;
  isOwnedByCurrentUser: boolean;
  handleDeleteMemClick: (id: number) => void;
  handleHeartClick: (memId: number) => void;
  setCommentsModal?: Dispatch<SetStateAction<boolean>>;
  isHearted: boolean;
  amountOfHearts: number;
  imgMaxH?: number;
  enableDelete?: boolean;
}

export default function MemItem({
  mem,
  isOwnedByCurrentUser,
  handleDeleteMemClick,
  handleHeartClick,
  setCommentsModal,
  isHearted,
  amountOfHearts,
  imgMaxH,
  enableDelete,
}: MemItemInterface) {
  return (
    <>
      <Link
        href={`user/${mem.owner.id}`}
        className="min-w-[4rem] flex justify-center mt-2"
      >
        {mem.owner.avatarImageUrl ? (
          <img // eslint-disable-line @next/next/no-img-element
            className="w-[3rem] h-[3rem] rounded-full object-cover"
            alt="submitted picture"
            src={mem.owner.avatarImageUrl}
          />
        ) : (
          <CgProfile className="rounded-full w-[3rem] h-[3rem] bg-gray-400 p-1 text-gray-300" />
        )}
      </Link>
      <div className="flex flex-col gap-1 grow">
        <div className="flex justify-between">
          <Link href={`/user/${mem.owner.id}`}>
            <div className="font-bold text-lg hover:underline">
              {mem.owner.username}
            </div>
          </Link>
          <div className="flex gap-2 items-center">
            <div className="text-sm">{mem.lastUpdateDate}</div>
            {(isOwnedByCurrentUser || enableDelete) && (
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
        {mem.imageUrl && (
          <img // eslint-disable-line @next/next/no-img-element
            src={mem.imageUrl}
            alt="Some mem idk"
            className="w-fit max-w-[100%]"
            style={{ maxHeight: imgMaxH ? `${imgMaxH}px` : "auto" }}
          />
        )}
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
            {/* should open the modal but that doesn't work currently */}
            {/* <Link href={`/mem/${mem.id}`}>
              <FaRegComment className="ml-4 hover:cursor-pointer" size={25} />
            </Link> */}
            {setCommentsModal && (
              <FaRegComment
                onClick={() => setCommentsModal(true)}
                className="ml-4 hover:cursor-pointer"
                size={25}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
