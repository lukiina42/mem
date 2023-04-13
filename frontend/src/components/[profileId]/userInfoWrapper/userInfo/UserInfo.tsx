"use client";

import { updateAvatar } from "@/clientApi/userApi";
import ModalWrapper from "@/components/util/ModalWrapper";
import { displayToast } from "@/components/util/toast";
import { User } from "@/types";
import { useSession } from "next-auth/react";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";
import ChangeAvatarForm from "./changeAvatarForm/ChangeAvatarForm";

export default function UserInfo({ user }: { user: User }) {
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [imageDeleted, setImageDeleted] = React.useState(false);

  const sessionUser = useSession();

  const router = useRouter();

  const fileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        setFile(event.target.files[0]);
        setImageDeleted(false);
      }
    }
  };

  const updateAvatarMutation = useMutation(updateAvatar, {
    onSuccess: () => {
      displayToast(
        "Avatar was changed successfully",
        "bottom-center",
        "success"
      );
      setFile(null);
      setShowProfileModal(false);
      router.refresh();
    },
    onError: () => {
      displayToast(
        "Something went wrong, please try again",
        "bottom-center",
        "error"
      );
    },
  });

  const handleSaveAvatar = () => {
    if (!file && !imageDeleted) return;
    if (sessionUser?.data?.user?.token) {
      updateAvatarMutation.mutate({
        file,
        token: sessionUser!.data!.user!.token,
      });
    }
  };

  const handleDeleteImageClick = () => {
    setImageDeleted(true);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <div className="sm:w-[95%] w-[90%] flex flex-col mt-3 mb-3 gap-4">
          <div className="flex gap-10 items-center">
            <div
              className="min-w-[4rem] flex justify-center mt-2 hover:bg-blue-100 hover:cursor-pointer duration-150 transition-all rounded-xl p-0.5"
              onClick={() => setShowProfileModal(true)}
            >
              {user.avatarImageUrl ? (
                <img // eslint-disable-line @next/next/no-img-element
                  className="w-[5rem] h-[5rem] rounded-full object-cover"
                  alt="current saved picture"
                  src={user.avatarImageUrl}
                />
              ) : (
                <CgProfile
                  size={55}
                  className="rounded-full bg-gray-400 p-1 text-gray-300"
                />
              )}
            </div>
            <div className="flex flex-col justify-between h-full hover:cursor-pointer duration-150 transition-all p-0.5 rounded-md">
              <div className="font-bold text-xl">{user.username}</div>
              <div className="font-bold text-lg"> {user.email}</div>
            </div>
          </div>
        </div>
      </div>
      {showProfileModal && (
        <ModalWrapper closeModal={() => setShowProfileModal(false)}>
          <ChangeAvatarForm
            setShowProfileModal={setShowProfileModal}
            file={file}
            handleDeleteImageClick={handleDeleteImageClick}
            imageDeleted={imageDeleted}
            fileSelected={fileSelected}
            handleSaveAvatar={handleSaveAvatar}
            avatarImageUrl={user.avatarImageUrl}
          />
        </ModalWrapper>
      )}
    </>
  );
}