"use client";

import { Mem } from "@/types";
import { CgProfile } from "react-icons/cg";
import { BsFillTrashFill } from "react-icons/bs";
import { User } from "next-auth";

interface MemItemInterface {
  mem: Mem;
  user: User | undefined;
  handleDeleteMemClick: (id: number) => void;
  displayBorder: boolean;
}

export default function MemItem({
  mem,
  user,
  handleDeleteMemClick,
  displayBorder,
}: MemItemInterface) {
  return (
    <div
      className={`w-full flex mt-3 pb-3 pr-2 ${displayBorder && "border-b"}`}
    >
      <div className="min-w-[4rem] flex justify-center mt-2">
        <CgProfile
          size={40}
          className="rounded-full bg-gray-400 p-1 text-gray-300"
        />
      </div>
      <div className="flex flex-col gap-1 grow">
        <div className="flex justify-between">
          <div className="font-bold text-lg">{mem.owner.username}</div>
          {user?.name === mem.owner.username && (
            <BsFillTrashFill
              size={30}
              className="text-red-500 p-1 rounded-full hover:bg-gray-200 duration-150 transition-all hover:cursor-pointer"
              onClick={() => handleDeleteMemClick(mem.id)}
            />
          )}
        </div>
        <div>{mem.content}</div>
        {/* dunno if I should have some min w here, small pictures are kinda small ngl xd */}
        <img // eslint-disable-line @next/next/no-img-element
          src={mem.imageUrl}
          alt="Some mem idk"
          className="w-fit max-w-[100%]"
        />
        <div className="w-full h-12 bg-slate-200"></div>
      </div>
    </div>
  );
}
