"use client";

import { Mem } from "@/types/mem";
import { useSession } from "next-auth/react";
import { useMutation } from "react-query";
import { deleteMem, heartMem } from "@/clientApiCalls/memApi";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/utilComponents/ConfirmationModal";
import React from "react";
import MemItem from "./memItem/MemItem";
import { displayToast } from "@/utilComponents/toast";
import MemItemWrapper from "./memItem/MemItemWrapper";

export default function MemsContainer({ mems }: { mems: Mem[] }) {
  const user = useSession().data?.user;
  const router = useRouter();

  ////delete mem
  const [memIdToDelete, setMemIdToDelete] = React.useState(0);

  const deleteMemMutation = useMutation(deleteMem, {
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
    deleteMemMutation.mutate({ memId: memIdToDelete, token: user!.token });
    setMemIdToDelete(0);
  };

  const handleCancelDeleteMem = () => {
    setMemIdToDelete(0);
  };
  ////

  ////heart mem
  const heartMemMutation = useMutation(heartMem, {
    onSuccess: () => {},
    onError: () => {
      displayToast(
        "Something went wrong while hearting mem, please try again",
        "bottom-center",
        "error"
      );
    },
  });

  const handleHeartMemRequest = (memId: number) => {
    //optimistic update here
    console.log(memId);
    heartMemMutation.mutate({ memId, token: user!.token });
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
          <MemItemWrapper
            key={mem.id}
            mem={mem}
            user={user}
            handleDeleteMemClick={handleDeleteMemClick}
            displayBorder={i !== mems.length - 1}
            handleHeartMemRequest={handleHeartMemRequest}
          />
        );
      })}
    </>
  );
}
