"use client";

import { Mem } from "@/types";
import { useSession } from "next-auth/react";
import { useMutation } from "react-query";
import { deleteMem } from "@/clientApi/memApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ConfirmationModal from "./deleteMemModal/ConfirmationModal";
import React from "react";
import MemItem from "./memItem/MemItem";

export default function MemsContainer({ mems }: { mems: Mem[] }) {
  const user = useSession().data?.user;
  const router = useRouter();

  const [memIdToDelete, setMemIdToDelete] = React.useState(0);

  const createMemMutation = useMutation(deleteMem, {
    onSuccess: () => {
      toast.success("The mem was successfully deleted", {
        position: "bottom-center",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.refresh();
    },
    onError: () => {
      toast.error("Something went wrong, please try again", {
        position: "bottom-center",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
