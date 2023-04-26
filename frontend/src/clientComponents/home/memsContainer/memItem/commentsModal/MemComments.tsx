"use client";

import { getComments } from "@/clientApiCalls/commentApi";
import { Mem } from "@/types/mem";
import LoadingSpinner from "@/utilComponents/Loading";
import ModalWrapper from "@/utilComponents/ModalWrapper";
import { useState } from "react";
import { useQuery } from "react-query";
import MemItem from "../MemItem";
import RecursiveComment from "./recursiveComment/RecursiveComment";
import NewCommentForm from "./newCommentForm/NewCommentForm";
import { User } from "next-auth";
import { Comment } from "@/types/comment";

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
  const { data, refetch, isLoading } = useQuery(`memComment${mem.id}`, () =>
    getComments({ memId: mem.id })
  );

  const [replyComment, setReplyComment] = useState<null | Comment>(null);

  return (
    <ModalWrapper closeModal={closeModal}>
      <div className="h-[90vh] w-[80vw] min-w-[260px] min-h-[260px] max-w-[800px] bg-white flex rounded-lg">
        <div className="w-full flex flex-col gap-2">
          <div className={`w-full flex mt-3 pb-3 pr-2 border-b`}>
            <MemItem
              key={mem.id}
              mem={mem}
              handleDeleteMemClick={handleDeleteMemClick}
              handleHeartClick={handleHeartClick}
              isHearted={isHearted}
              amountOfHearts={amountOfHearts}
              isOwnedByCurrentUser={isOwnedByCurrentUser}
              imgMaxH={240}
            />
          </div>
          {isLoading ? (
            <div className="h-full w-full flex justify justify-center items-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="flex w-full">
              <div className="md:w-16 w-4"></div>
              <div className="grow">
                {user && (
                  <NewCommentForm
                    replyComment={replyComment}
                    memId={mem.id}
                    refetch={refetch}
                    user={user}
                    setReplyComment={setReplyComment}
                  />
                )}

                <div className={`flex flex-col mb-4 mt-4 overflow-y-auto`}>
                  {data?.length == 0 ? (
                    <div>No comments yet!</div>
                  ) : (
                    data?.map((comment, i) => {
                      return (
                        <RecursiveComment
                          key={comment.id}
                          isRoot={true}
                          comment={comment}
                          marginLeft={0}
                          isFirst={i == 0}
                          setReplyComment={setReplyComment}
                          replyComment={replyComment}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}
