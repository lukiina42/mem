"use client";

import ModalWrapper from "@/utilComponents/ModalWrapper";
import { useQuery } from "react-query";

export default function MemComments({
  memId,
  closeModal,
}: {
  memId: number;
  closeModal: () => void;
}) {
  const { data, isLoading, refetch } = useQuery();
  return (
    <ModalWrapper closeModal={closeModal}>
      <div>Ahoj</div>
    </ModalWrapper>
  );
}
