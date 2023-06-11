import { getPotentialFriends } from "@/serverApiCalls/users";
import UserRecommendationCard from "./(components)/UserRecommendationCard";

export default async function page() {
  const { users, sessionData } = await getPotentialFriends();

  return (
    <div className="w-full h-full flex flex-col items-start mt-8 ml-8">
      <div className="flex flex-col items-start">
        <div className="flex flex-col text-md font-bold">
          Your recommendations:
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {users.map((user) => {
            return <UserRecommendationCard user={user} />;
          })}
        </div>
      </div>
    </div>
  );
}
