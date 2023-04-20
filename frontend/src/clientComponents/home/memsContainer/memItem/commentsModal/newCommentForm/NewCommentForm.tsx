"use client";

import { useState } from "react";

import { ImFilePicture } from "react-icons/im";
import { GrClose } from "react-icons/gr";
import { useMutation } from "react-query";
import { createMem } from "@/clientApiCalls/memApi";
import LoadingSpinner from "@/utilComponents/Loading";
import { displayToast } from "@/utilComponents/toast";
import { createComment } from "@/clientApiCalls/commentApi";
import { User } from "next-auth";
import { AiOutlineSend } from "react-icons/ai";

interface NewCommentFormProps {
  user: User;
  refetch: () => void;
  memId: number;
}

export default function NewCommentForm(props: NewCommentFormProps) {
  const { refetch, user, memId } = props;
  const [inputContent, setInputContent] = useState("");

  const createCommentMutation = useMutation(createComment, {
    onSuccess: () => {
      displayToast("You successfully commented", "bottom-center", "success");
      setInputContent("");
      refetch();
    },
    onError: () => {
      displayToast(
        "Something went wrong while adding comment, please try again",
        "bottom-center",
        "error"
      );
    },
  });

  const handleContentInputChange = (text: string) => {
    setInputContent(text);
  };

  const loading = createCommentMutation.status === "loading";

  const onSubmit = () => {
    if (!inputContent) return;
    createCommentMutation.mutate({
      content: inputContent,
      memParentId: memId,
      token: user.token,
    });
  };

  return (
    <div className="h-fit w-full flex justify-center items-center">
      <div className="relative flex h-full flex-grow pb-1 items-center ml-16 mr-4">
        <textarea
          className={`text-xl rounded-xl py-2 resize-none border w-full px-2`}
          rows={1}
          placeholder="Write your comment here"
          value={inputContent}
          onChange={(e) => handleContentInputChange(e.target.value)}
        />
        <AiOutlineSend
          className="absolute right-1 hover:cursor-pointer"
          onClick={onSubmit}
          size={20}
        />
      </div>
    </div>
  );
}
