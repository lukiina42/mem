"use client";
import { UserData } from "@/app/user/[id]/page";
import {
  useBanUserMutation,
  useFollowUserMutation,
} from "@/clientApiCalls/reactQuery/user";
import LoadingSpinner from "@/utilComponents/Loading";
import { displayToast } from "@/utilComponents/toast";
import { JWT } from "next-auth/jwt";
import { useRouter } from "next/navigation";
import { BsFillFlagFill, BsFlag } from "react-icons/bs";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";

export default function ProfileHeader({
  user,
  sessionData,
}: {
  user: UserData;
  sessionData: JWT | null;
}) {
  const router = useRouter();

  const isAdmin = sessionData?.roles.some((role) => role == "admin");

  const followUserMutation = useFollowUserMutation(
    () => {
      displayToast(
        `You successfully ${
          user.followedByCurrentUser ? "unfollowed" : "followed"
        } ${user.username}`,
        "bottom-center",
        "success"
      );
      router.refresh();
    },
    () => {
      displayToast(
        "Something went wrong, please try again",
        "bottom-center",
        "error"
      );
    }
  );

  const banUserMutation = useBanUserMutation(
    () => {
      displayToast(
        `${
          user.isBanned
            ? "User was unbanned"
            : "This user was succefully banned, get rekt"
        }`,
        "bottom-center",
        "success"
      );
      router.refresh();
    },
    () => {
      displayToast(
        "Something went wrong while (un)banning user, please try again",
        "bottom-center",
        "error"
      );
    }
  );

  const handleFollowClick = () => {
    if (sessionData?.token) {
      followUserMutation.mutate({
        followedId: user.id,
        token: sessionData?.token,
      });
    }
  };

  const handleBanClick = () => {
    banUserMutation.mutate({
      token: sessionData!.token,
      bannedUserId: user.id,
    });
  };

  return (
    <div className="h-16 w-full justify-between flex items-center border-b-2">
      <div className="font-bold text-xl ml-4 h-16 flex items-center">
        {user.username}&apos;s mems
      </div>
      <div className="flex gap-1">
        {sessionData?.token && (
          <div
            className="relative mr-4 hover:cursor-pointer group"
            onClick={handleFollowClick}
          >
            {followUserMutation.isLoading ? (
              <LoadingSpinner />
            ) : user.followedByCurrentUser ? (
              <SlUserUnfollow size={25} />
            ) : (
              <SlUserFollow size={25} />
            )}

            <span className="tooltip origin-top-right group-hover:scale-100 right-full top-1/4">
              {user.followedByCurrentUser ? "Unfollow" : "Follow"}
            </span>
          </div>
        )}
        {isAdmin ? (
          <div
            className="relative mr-4 hover:cursor-pointer group"
            onClick={handleBanClick}
          >
            {user.isBanned ? (
              <BsFillFlagFill size={25} className="text-red-500" />
            ) : (
              <BsFlag size={25} className="text-red-500" />
            )}
            <span className="tooltip origin-top-right group-hover:scale-100 top-full ml-auto mr-auto right-full text-center">
              {user.isBanned
                ? "Free this user from eternal pain"
                : "Ban this user"}
            </span>
          </div>
        ) : (
          user.isBanned && (
            <>
              <BsFillFlagFill size={25} className="text-red-500" />
              <span className="tooltip origin-top-right group-hover:scale-100 top-full ml-auto mr-auto right-full text-center">
                Banned user (he got rekt)
              </span>
            </>
          )
        )}
      </div>
    </div>
  );
}
