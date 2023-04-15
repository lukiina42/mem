"use client";
import { followUser } from "@/clientApi/userApi";
import { displayToast } from "@/utilComponents/toast";
import { useSession } from "next-auth/react";
import { SlUserFollow } from "react-icons/sl";
import { useMutation } from "react-query";

export default function ProfileHeader({
  username,
  id,
}: {
  username: string;
  id: number;
}) {
  const updateAvatarMutation = useMutation(followUser, {
    onSuccess: () => {
      displayToast(
        `You successfully followed ${username}`,
        "bottom-center",
        "success"
      );
    },
    onError: () => {
      displayToast(
        "Something went wrong, please try again",
        "bottom-center",
        "error"
      );
    },
  });

  const session = useSession();

  const handleFollowClick = () => {
    if (session.data?.user?.token) {
      updateAvatarMutation.mutate({
        followedId: id,
        token: session.data?.user?.token,
      });
    }
  };

  return (
    <div className="h-16 w-full justify-between flex items-center border-b-2">
      <div className="font-bold text-xl ml-4">{username}&apos;s mems</div>
      <div
        className="relative mr-4 hover:cursor-pointer group"
        onClick={handleFollowClick}
      >
        <SlUserFollow size={25} />
        <span className="sidebar-tooltip group-hover:scale-100 -left-[130%]">
          Follow
        </span>
      </div>
    </div>
  );
}
