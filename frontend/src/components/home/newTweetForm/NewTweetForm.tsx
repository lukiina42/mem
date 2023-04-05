"use client";

import { useState } from "react";

import { ImFilePicture } from "react-icons/im";
import { GrClose } from "react-icons/gr";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createMem } from "@/clientApi/memApi";
import { useSession } from "next-auth/react";
import { User } from "next-auth";

//lazy solution
const getAmountOfRows = (input: string) => {
  const amountOfEnter = input.split("\n").length - 1;
  if (input.length < 35 && amountOfEnter < 2) return 2;
  return 3;
};

export default function NewTweetForm() {
  const [file, setFile] = useState<File | null>(null);
  const [inputContent, setInputContent] = useState("");

  const { data } = useSession();

  const user = data?.user as User;

  const fileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      event.target.files[0] && setFile(event.target.files[0]);
    }
  };

  const createMemMutation = useMutation(createMem, {
    onSuccess: () => {
      toast.success("You successfully memd", {
        position: "bottom-center",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
  });

  const onSubmit = () => {
    createMemMutation.mutate({
      content: inputContent,
      image: file,
      userEmail: user.email as string,
      token: user.token,
    });
  };

  return (
    <div className="h-fit w-full flex justify-center">
      <div className="relative flex flex-col h-full w-4/5 pb-1 border-b">
        <textarea
          className="text-xl active:border-none focus:outline-none py-2 resize-none"
          rows={getAmountOfRows(inputContent)}
          placeholder="Write some mem!"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
        />
        {file && (
          <div className="w-full h-full relative pb-2">
            <div
              className="absolute top-2 right-2"
              onClick={() => setFile(null)}
            >
              <GrClose
                className="text-black rounded-full p-1 hover:bg-blue-200 hover:cursor-pointer transition-all duration-150"
                size={30}
              />
            </div>
            <img // eslint-disable-line @next/next/no-img-element
              width={"100%"}
              alt="submitted picture"
              src={URL.createObjectURL(file)}
            />
          </div>
        )}
        <div className="w-full flex justify-between items-center mt-2">
          <label htmlFor="file">
            <ImFilePicture
              size={25}
              className="hover:text-blue-500 transition-all duration-150 hover:cursor-pointer"
            />
          </label>
          <input
            id="file"
            onChange={fileSelected}
            type="file"
            accept="image/*"
            className="hidden"
          ></input>

          <button
            className="basic-button w-24"
            type="submit"
            onClick={onSubmit}
          >
            Mem
          </button>
        </div>
      </div>
    </div>
  );
}
