"use client";

import Image from "next/image";
import { useState } from "react";

import { ImFilePicture } from "react-icons/im";
import { GrClose } from "react-icons/gr";

//lazy solution
const getAmountOfRows = (input: string) => {
  const amountOfEnter = input.split("\n").length - 1;
  if (input.length < 35 && amountOfEnter < 2) return 2;
  return 3;
};

export default function NewTweetForm() {
  const [file, setFile] = useState(null);
  const [inputContent, setInputContent] = useState("");

  const fileSelected = (event: any) => {
    event.target.files[0] && setFile(event.target.files[0]);
  };

  return (
    <div className="h-fit w-full flex justify-center">
      <div className="relative flex flex-col h-full w-4/5">
        <textarea
          className="text-xl active:border-none focus:outline-none py-2 resize-none"
          rows={getAmountOfRows(inputContent)}
          placeholder="Write some mem!"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
        />
        {file && (
          <div className="w-full h-full relative">
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
              size={20}
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

          <button className="basic-button w-24" type="submit">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
