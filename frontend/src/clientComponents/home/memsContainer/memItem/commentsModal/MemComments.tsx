"use client";

import { getComments } from "@/clientApiCalls/commentUtils";
import LoadingSpinner from "@/utilComponents/Loading";
import ModalWrapper from "@/utilComponents/ModalWrapper";
import { useQuery } from "react-query";

export default function MemComments({
  memId,
  closeModal,
}: {
  memId: number;
  closeModal: () => void;
}) {
  const { data, isLoading, refetch } = useQuery("memComments", () =>
    getComments({ memId })
  );
  console.log(data);
  return (
    <ModalWrapper closeModal={closeModal}>
      <div className="h-[500px] w-[500px] bg-white flex justify-center items-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {data?.map((comment) => {
              return <div key={comment.id}></div>;
            })}
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}
