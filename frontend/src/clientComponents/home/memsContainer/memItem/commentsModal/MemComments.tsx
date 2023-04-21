"use client";

import { getComments } from "@/clientApiCalls/commentApi";
import { Mem } from "@/types/mem";
import LoadingSpinner from "@/utilComponents/Loading";
import ModalWrapper from "@/utilComponents/ModalWrapper";
import Link from "next/link";
import { useQuery } from "react-query";
import MemItem from "../MemItem";
import RecursiveComment from "./recursiveComment/RecursiveComment";
import NewCommentForm from "./newCommentForm/NewCommentForm";
import { User } from "next-auth";

interface MemCommentsProps {
  mem: Mem;
  closeModal: () => void;
  isHearted: boolean;
  amountOfHearts: number;
  handleHeartClick: (memId: number) => void;
  isOwnedByCurrentUser: boolean;
  handleDeleteMemClick: (id: number) => void;
  user: User | undefined;
}

export default function MemComments({
  mem,
  closeModal,
  isHearted,
  amountOfHearts,
  handleHeartClick,
  handleDeleteMemClick,
  isOwnedByCurrentUser,
  user,
}: MemCommentsProps) {
  const { data, isLoading, refetch } = useQuery("memComments", () =>
    getComments({ memId: mem.id })
  );

  return (
    <ModalWrapper closeModal={closeModal}>
      <div className="h-[90vh] w-[80vw] min-w-[260px] min-h-[260px] max-w-[800px] bg-white flex">
        {isLoading ? (
          <div className="h-full w-full flex justify justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-1">
            <div className={`w-full flex mt-3 pb-3 pr-2 border-b`}>
              <MemItem
                key={mem.id}
                mem={mem}
                handleDeleteMemClick={handleDeleteMemClick}
                handleHeartClick={handleHeartClick}
                isHearted={isHearted}
                amountOfHearts={amountOfHearts}
                isOwnedByCurrentUser={isOwnedByCurrentUser}
              />
            </div>
            {data?.length == 0 ? (
              <div>Nothing in here lulw</div>
            ) : (
              <>
                {user && (
                  <NewCommentForm
                    memId={mem.id}
                    refetch={refetch}
                    user={user}
                  />
                )}
                <div className="mt-2 flex flex-col ml-16">
                  {data?.map((comment) => {
                    return (
                      <RecursiveComment
                        key={comment.id}
                        isRoot={true}
                        comment={comment}
                        marginLeft={0}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}
