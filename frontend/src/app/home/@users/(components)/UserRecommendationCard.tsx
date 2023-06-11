import { PotentialFriend } from "@/types/user";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";

interface UserRecommendationCardType {
  user: PotentialFriend;
}

export default function UserRecommendationCard(
  props: UserRecommendationCardType
) {
  const { user } = props;
  const recommendationDescription = user.commonFollowersPresent
    ? `Followed by ${user.commonFollowersAmount} people you follow`
    : `Followed by ${user.followersAmount} people`;
  return (
    <div className="flex gap-2">
      <Link href={`/user/${user.id}`}>
        {user.avatarImageUrl ? (
          <img // eslint-disable-line @next/next/no-img-element
            className="w-[3rem] h-[3rem] rounded-full object-cover"
            alt="current saved picture"
            src={user.avatarImageUrl}
          />
        ) : (
          <CgProfile className="w-[3rem] h-[3rem] rounded-full bg-gray-400 p-1 text-gray-300" />
        )}
      </Link>
      <div className="flex flex-col gap-1">
        <Link href={`/user/${user.id}`}>
          <div className="font-bold text-lg">{user.username}</div>
        </Link>
        <div className="text-sm text-gray-300">{recommendationDescription}</div>
      </div>
    </div>
  );
}
