import { User } from "@/types/user";
import { useState } from "react";

export const useHeart = (
  heartedByCurrentUser: boolean,
  heartedBy: User[],
  handleHeartMemRequest: (id: number) => void
) => {
  const [heartChanged, setHeartChanged] = useState(false);

  const isHearted = !heartChanged
    ? heartedByCurrentUser
    : !heartedByCurrentUser;

  const amountOfHearts = !heartChanged
    ? heartedBy.length
    : heartedByCurrentUser
    ? heartedBy.length - 1
    : heartedBy.length + 1;

  const handleHeartClick = (id: number) => {
    setHeartChanged(!heartChanged);
    handleHeartMemRequest(id);
  };

  return { isHearted, amountOfHearts, handleHeartClick };
};
