"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { useMutation } from "react-query";
import LoadingSpinner from "@/utilComponents/Loading";
import { displayToast } from "@/utilComponents/toast";
import { createComment } from "@/clientApiCalls/commentApi";
import { AiOutlineSend } from "react-icons/ai";
import { Comment } from "@/types/comment";

interface NewCommentFormProps {
  token: string;
  refetch: () => void;
  memId: number;
  replyComment: null | Comment;
  setReplyComment: Dispatch<SetStateAction<null | Comment>>;
}

export default function NewCommentForm(props: NewCommentFormProps) {
  const { refetch, token, memId, replyComment, setReplyComment } = props;
  const [inputContent, setInputContent] = useState("");

  const createCommentMutation = useMutation(createComment, {
    onSuccess: () => {
      setInputContent("");
      refetch();
      setReplyComment(null);
    },
    onError: () => {
      displayToast(
        "Something went wrong while adding comment, please try again",
        "bottom-center",
        "error"
      );
    },
  });

  const handleContentInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (event.target.value.endsWith("\n")) {
      return;
    }
    setInputContent(event.target.value);
  };

  const loading = createCommentMutation.status === "loading";

  const onSubmit = () => {
    if (!inputContent) return;
    if (replyComment) {
      createCommentMutation.mutate({
        content: inputContent,
        commentParentId: replyComment.id,
        token,
      });
      return;
    }
    createCommentMutation.mutate({
      content: inputContent,
      memParentId: memId,
      token,
    });
  };

  return (
    <div className="flex flex-col gap-1">
      {replyComment && (
        <div className="flex gap-4 items-center">
          <div className="text-sm text-gray-500">
            Answering to {replyComment.ownerUsername}
          </div>
          <div
            onClick={() => setReplyComment(null)}
            className="hover:cursor-pointer text-sm"
          >
            X
          </div>
        </div>
      )}
      <div className="h-fit w-full flex justify-center items-center">
        <div className="relative flex h-full flex-grow pb-1 items-center mr-4">
          <textarea
            className={`text-xl rounded-xl py-2 resize-none border w-full px-2`}
            rows={1}
            placeholder="Write your comment here"
            value={inputContent}
            onChange={handleContentInputChange}
            onKeyDown={(e) => {
              if (e.key == "Enter") onSubmit();
            }}
          />
          <div className="absolute right-1">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <AiOutlineSend
                className="hover:cursor-pointer mr-2"
                onClick={onSubmit}
                size={20}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
