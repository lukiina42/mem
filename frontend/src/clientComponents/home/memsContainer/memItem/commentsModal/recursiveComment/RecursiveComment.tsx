"use client";

import { Comment } from "@/types/comment";

interface RecursiveCommentProps {
  comment: Comment;
  marginLeft: number;
  isRoot: boolean;
}

export default function RecursiveComment(props: RecursiveCommentProps) {
  const { comment, marginLeft, isRoot } = props;
  return (
    <>
      <div
        style={{ marginLeft: `${marginLeft}rem` }}
        className={`w-fit flex gap-1 items-start px-3 py-2 bg-slate-100 rounded-3xl ${
          isRoot && "mt-2"
        }`}
      >
        <div className="font-bold hover:cursor-pointer hover:underline">
          {comment.ownerUsername}
        </div>
        <div>{comment.content}</div>
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
