"use client";

import { Comment } from "@/types/comment";
import { BsReply } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { SetStateAction, Dispatch } from "react";

interface RecursiveCommentProps {
  comment: Comment;
  marginLeft: number;
  isRoot: boolean;
  isFirst: boolean;
  setReplyComment: Dispatch<SetStateAction<null | Comment>>;
  replyComment: null | Comment;
}

export default function RecursiveComment(props: RecursiveCommentProps) {
  const {
    comment,
    marginLeft,
    isRoot,
    isFirst,
    setReplyComment,
    replyComment,
  } = props;

  const leftDivsArray = [];
  for (let i = 0; i < marginLeft; i++) {
    leftDivsArray.push(i);
  }

  return (
    <>
      <div className="flex flex-col">
        {!isRoot && <div className="h-1 border-l-[1px] w-full" />}
        <div className={`flex`}>
          {leftDivsArray.map((item) => {
            return (
              <div key={item} className="flex flex-col items-center w-4">
                <>
                  <div
                    className={`h-1/2 w-full ${
                      item == marginLeft - 1 && "border-b-[1px]"
                    } border-l-[1px]`}
                  />
                  <div className="h-1/2 w-full border-l-[1px]" />
                </>
              </div>
            );
          })}
          <div className="flex gap-1 items-center">
            <div
              className={`w-fit flex items-start px-3 py-2 gap-2 ${
                replyComment?.id === comment.id ? "bg-blue-100" : "bg-slate-100"
              }  rounded-3xl ${isRoot && !isFirst && "mt-2"}`}
            >
              <div className="font-bold hover:cursor-pointer hover:underline">
                {comment.ownerUsername}
              </div>
              <div>{comment.content}</div>
            </div>
            <BsReply
              size={20}
              className={`${isRoot && !isFirst && "mt-2"} hover:cursor-pointer`}
              onClick={() => setReplyComment(comment)}
            />
            <AiOutlineHeart
              size={20}
              className={`${isRoot && !isFirst && "mt-2"} hover:cursor-pointer`}
            />
          </div>
        </div>
      </div>

      {comment.answers !== undefined &&
        comment.answers.map((childComment) => {
          return (
            <RecursiveComment
              key={childComment.id}
              comment={childComment}
              marginLeft={marginLeft + 1}
              isRoot={false}
              isFirst={false}
              setReplyComment={setReplyComment}
              replyComment={replyComment}
            />
          );
        })}
    </>
  );
}
