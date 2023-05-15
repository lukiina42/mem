"use client";

import { Comment } from "@/types/comment";
import { BsReply } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { SetStateAction, Dispatch } from "react";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";

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
        <div className={`flex`}>
          {leftDivsArray.map((item, index) => {
            return (
              <div
                key={item}
                className={`flex flex-col items-center ml-5 min-w-4 w-4`}
              >
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
            {comment.ownerAvatarUrl ? (
              <img // eslint-disable-line @next/next/no-img-element
                className="w-[2.5rem] h-[2.5rem] min-w-[2.5rem] min-h-[2.5rem] rounded-full object-cover"
                alt="submitted picture"
                src={comment.ownerAvatarUrl}
              />
            ) : (
              <CgProfile className="w-[2.5rem] h-[2.5rem] min-w-[2.5rem] min-h-[2.5rem] rounded-full bg-gray-400 p-1 text-gray-300" />
            )}
            <div className="flex flex-col">
              <div
                className={`w-fit flex items-start px-3 py-2 gap-2 ${
                  replyComment?.id === comment.id
                    ? "bg-blue-100"
                    : "bg-slate-100"
                }  rounded-3xl ${isRoot && !isFirst && "mt-2"}`}
              >
                <Link href={`/user/${comment.ownerId}`}>
                  <div className="font-bold hover:cursor-pointer hover:underline">
                    {comment.ownerUsername}
                  </div>
                </Link>
                <div className="flex flex-nowrap">{comment.content}</div>
              </div>
              <div className="flex gap-2 pb-1">
                <div
                  className="text-xs ml-4 hover:cursor-pointer hover:underline"
                  onClick={() => setReplyComment(comment)}
                >
                  answer
                </div>
                <div className="text-xs">like</div>
              </div>
            </div>
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
