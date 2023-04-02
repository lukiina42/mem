import HomeContentWrapper from "@/components/home/HomeContentWrapper";

export default async function page() {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="h-16 w-full flex items-center border-b-2">
        <div className="font-bold text-xl ml-4">Home</div>
      </div>
      <div className="grow">
        <HomeContentWrapper />
      </div>
    </div>
  );
}
