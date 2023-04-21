"use client";

import { Comment } from "@/types/comment";

interface RecursiveCommentProps {
  comment: Comment;
  marginLeft: number;
  isRoot: boolean;
}

export default function RecursiveComment(props: RecursiveCommentProps) {
  const { comment, marginLeft, isRoot } = props;

  //${!isRoot && "border-l-[1px]"} pt-1
  return (
    <>
      <div className="flex flex-col">
        {!isRoot && <div className="h-1 border-l-[1px] w-full" />}
        <div className={`flex`}>
          <div
            style={{ width: `${marginLeft}rem` }}
            className="flex flex-col items-center"
          >
            {!isRoot && (
              <>
                <div className="h-1/2 w-full border-b-[1px] border-l-[1px]" />
                <div className="h-1/2 w-full border-l-[1px]" />
              </>
            )}
          </div>
          <div
            className={`w-fit flex items-start px-3 py-2 bg-slate-100 rounded-3xl ${
              isRoot && "mt-2"
            }`}
          >
            <div className="font-bold hover:cursor-pointer hover:underline">
              {comment.ownerUsername}
            </div>
            <div>{comment.content}</div>
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
            />
          );
        })}
    </>
  );
}
