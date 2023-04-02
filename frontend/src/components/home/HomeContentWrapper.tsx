"use client";

import NewTweetForm from "./newTweetForm/NewTweetForm";

export default function HomeContentWrapper() {
  return (
    <div className="w-full flex flex-col">
      <NewTweetForm />
    </div>
  );
}
