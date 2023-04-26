"use client";

import React, { SetStateAction } from "react";
import { FcDeleteRow } from "react-icons/fc";
import { GrClose } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";

interface ChangeAvatarFormProps {
  setShowProfileModal: React.Dispatch<SetStateAction<boolean>>;
  file: File | null;
  handleDeleteImageClick: () => void;
  imageDeleted: boolean;
  fileSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveAvatar: () => void;
  avatarImageUrl: string | undefined;
  isLoading: boolean;
}

export default function ChangeAvatarForm(props: ChangeAvatarFormProps) {
  const {
    setShowProfileModal,
    file,
    handleDeleteImageClick,
    imageDeleted,
    fileSelected,
    handleSaveAvatar,
    avatarImageUrl,
    isLoading,
  } = props;
  return (
    <div className="relative w-[350px] h-[350px] bg-white rounded-lg">
      <div
        className="absolute top-1 right-1"
        onClick={(e) => {
          setShowProfileModal(false);
        }}
      >
        <GrClose
          className="text-black rounded-full p-1 hover:bg-blue-200 hover:cursor-pointer transition-all duration-150"
          size={30}
        />
      </div>
      {(file !== null || avatarImageUrl) && (
        <div
          className="absolute top-12 right-12 group"
          onClick={handleDeleteImageClick}
        >
          <FcDeleteRow
            className="text-black hover:bg-blue-50 rounded-sm hover:cursor-pointer"
            size={25}
          />
          <span className="sidebar-tooltip group-hover:scale-100 @[200px]:hidden block">
            Delete the image
          </span>
        </div>
      )}
      <div className="flex flex-col gap-2 items-center justify-center h-full">
        <label
          htmlFor="file"
          className="flex justify-center mt-2 hover:cursor-pointer"
        >
          {file ? (
            <div className="relative pb-2">
              <img // eslint-disable-line @next/next/no-img-element
                className="w-[12rem] h-[12rem] rounded-full object-cover"
                alt="submitted picture"
                src={URL.createObjectURL(file)}
              />
            </div>
          ) : avatarImageUrl && !imageDeleted ? (
            <img // eslint-disable-line @next/next/no-img-element
              className="w-[12rem] h-[12rem] rounded-full object-cover"
              alt="current saved picture"
              src={avatarImageUrl}
            />
          ) : (
            <CgProfile
              size={150}
              className="rounded-full bg-gray-400 text-gray-300"
            />
          )}
        </label>
        <input
          id="file"
          onChange={fileSelected}
          type="file"
          accept="image/*"
          className="hidden"
        ></input>
        <button
          disabled={isLoading}
          onClick={handleSaveAvatar}
          className="basic-button w-[4rem]"
        >
          Save
        </button>
      </div>
    </div>
  );
}
