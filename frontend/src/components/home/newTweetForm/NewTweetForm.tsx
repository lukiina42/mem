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
      setFile(null);
      setInputContent("");
    },
    onError: () => {
      toast.error("Something went wrong, please try again", {
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

  const loading = createMemMutation.status === "loading";

  const onSubmit = () => {
    createMemMutation.mutate({
      content: inputContent,
      image: file,
      userEmail: user.email as string,
      token: user.token,
    });
  };

  return (
    <div className="h-fit w-full flex justify-center items-center">
      {loading ? (
        <div role="status" className="mt-8">
          <svg
            aria-hidden="true"
            className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
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
      )}
    </div>
  );
}
