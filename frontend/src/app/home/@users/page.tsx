import { getPotentialFriends } from "@/serverApiCalls/users";
import UserRecommendationCard from "./(components)/UserRecommendationCard";

export default async function page() {
  const { users, sessionData } = await getPotentialFriends();

  console.log(users, sessionData)

  return (
    <div className="w-full h-full flex flex-col items-start mt-8 ml-8">
      <div className="flex flex-col items-start">
        <div className="flex flex-col text-md font-bold">
          Your recommendations:
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {users.length === 0 ? "Noone to recommend at the moment" : users.map((user) => {
            return <UserRecommendationCard key={user.id} user={user} />;
          })}
        </div>
      </div>
    </div>
  );
}
