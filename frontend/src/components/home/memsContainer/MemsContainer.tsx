"use client";

import { Mem } from "@/types";
import { useSession } from "next-auth/react";
import { useMutation } from "react-query";
import { deleteMem } from "@/clientApi/memApi";
import { useRouter } from "next/navigation";
import ConfirmationModal from "../../util/ConfirmationModal";
import React from "react";
import MemItem from "./memItem/MemItem";
import { displayToast } from "@/components/util/toast";

export default function MemsContainer({ mems }: { mems: Mem[] }) {
  const user = useSession().data?.user;
  const router = useRouter();

  const [memIdToDelete, setMemIdToDelete] = React.useState(0);

  const createMemMutation = useMutation(deleteMem, {
    onSuccess: () => {
      displayToast(
        "The mem was successfully deleted",
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

  const handleDeleteMemClick = (id: number) => setMemIdToDelete(id);

  const handleDeleteMem = () => {
    createMemMutation.mutate({ memId: memIdToDelete, token: user!.token });
    setMemIdToDelete(0);
  };

  const handleCancelDeleteMem = () => {
    setMemIdToDelete(0);
  };

  return (
    <>
      {memIdToDelete !== 0 && (
        <ConfirmationModal
          title="Are you sure you want to delete the mem - Is it perhaps unfunny
                and cringe?????????"
          handleConfirm={handleDeleteMem}
          handleCancel={handleCancelDeleteMem}
          confirmButtonText="Yes - Delete (Cringe)"
          cancelButtonText="No, preserve funny (Chad)"
        />
      )}
      {mems.map((mem, i) => {
        return (
          <MemItem
            key={mem.id}
            mem={mem}
            user={user}
            handleDeleteMemClick={handleDeleteMemClick}
            displayBorder={i !== mems.length - 1}
          />
        );
      })}
    </>
  );
}
