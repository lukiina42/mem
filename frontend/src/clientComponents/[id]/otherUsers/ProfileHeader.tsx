"use client";
import { followUser } from "@/clientApiCalls/userApi";
import { displayToast } from "@/utilComponents/toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { useMutation } from "react-query";

export default function ProfileHeader({
  username,
  id,
  isFollowedByCurrentUser,
}: {
  username: string;
  id: number;
  isFollowedByCurrentUser: boolean;
}) {
  const router = useRouter();

  const followUserMutation = useMutation(followUser, {
    onSuccess: () => {
      displayToast(
        `You successfully ${
          isFollowedByCurrentUser ? "unfollowed" : "followed"
        } ${username}`,
        "bottom-center",
        "success"
      );
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

  const session = useSession();

  const handleFollowClick = () => {
    if (session.data?.user?.token) {
      followUserMutation.mutate({
        followedId: id,
        token: session.data?.user?.token,
      });
    }
  };

  return (
    <div className="h-16 w-full justify-between flex items-center border-b-2">
      <div className="font-bold text-xl ml-4">{username}&apos;s mems</div>
      {session.data?.user?.token && (
        <div
          className="relative mr-4 hover:cursor-pointer group"
          onClick={handleFollowClick}
        >
          {isFollowedByCurrentUser ? (
            <SlUserUnfollow size={25} />
          ) : (
            <SlUserFollow size={25} />
          )}

          <span className="sidebar-tooltip group-hover:scale-100 -left-[210%]">
            {isFollowedByCurrentUser ? "Unfollow" : "Follow"}
          </span>
        </div>
      )}
    </div>
  );
}