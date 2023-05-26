"use client";

import { Mem } from "@/types/mem";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "react-query";
import { deleteMem, getMems } from "@/clientApiCalls/memApi";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/utilComponents/ConfirmationModal";
import React, { useEffect, useRef, useState } from "react";
import { displayToast } from "@/utilComponents/toast";
import MemItemWrapper from "./memItem/MemItemWrapper";
import { useHeartMutation } from "@/clientApiCalls/reactQuery/heartMutation";
import { InView } from "react-intersection-observer";
import { JWT } from "next-auth/jwt";

export default function MemsContainer({
  mems,
  requestUrl,
  requestingUserId,
  sessionData,
}: {
  mems: Mem[];
  requestUrl: "/mems/home/newest" | "/" | string;
  requestingUserId?: number;
  sessionData: JWT | null;
}) {
  const router = useRouter();

  const [localMems, setLocalMems] = useState(mems);
  const [allMemsFetched, setAllMemsFetched] = useState(mems.length < 10);

  const enableMoreMems = useRef(false);

  //the mems can be changed by user at home when he changes following to newest and vice versa
  //I don't like using effect but I don't want to duplicate the same functionality in the parent components
  //so I synchronize it this way
  useEffect(() => {
    setLocalMems(mems);
    enableMoreMems.current = false;
    const enableFetchTimeout = setTimeout(
      () => (enableMoreMems.current = true),
      500
    );
    return () => clearTimeout(enableFetchTimeout);
  }, [mems]);

  const handleSecondToLastMemInView = () => {
    if (enableMoreMems.current) refetch();
  };

  //continue here - pass the current number from which to fetch
  const { refetch } = useQuery(
    ["fetch_additional_mems"],
    () =>
      getMems({
        token: sessionData!.token,
        requestUrl,
        from: localMems.length,
        to: localMems.length + 9,
        requestingUser: requestUrl.startsWith("/user")
          ? requestingUserId?.toString()
          : "",
      }),
    {
      refetchOnWindowFocus: false,
      enabled: false, // disable this query from automatically running
      onSuccess: (data) => {
        let dataConverted: Mem[];
        //the home api call returns the mems in an object
        if ("mems" in data) {
          dataConverted = data.mems as Mem[];
        } else {
          dataConverted = data;
        }
        if (dataConverted.length == 0) {
          setAllMemsFetched(true);
        } else {
          setLocalMems((currMems) => {
            return [...currMems, ...dataConverted];
          });
        }
      },
    }
  );

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
    deleteMemMutation.mutate({
      memId: memIdToDelete,
      token: sessionData!.token,
    });
    setMemIdToDelete(0);
  };

  const handleCancelDeleteMem = () => {
    setMemIdToDelete(0);
  };
  ////

  const heartMemMutation = useHeartMutation();

  const handleHeartMemRequest = (memId: number) => {
    if (!sessionData) {
      displayToast(
        "You must be logged in to do that xd",
        "bottom-center",
        "info"
      );
    } else {
      heartMemMutation.mutate({ memId, token: sessionData!.token });
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
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
      {localMems.map((mem, i) => {
        return i == mems.length - 2 ? (
          <InView key={mem.id} as="div" onChange={handleSecondToLastMemInView}>
            <MemItemWrapper
              key={mem.id}
              mem={mem}
              user={sessionData}
              handleDeleteMemClick={handleDeleteMemClick}
              displayBorder={i !== mems.length - 1}
              handleHeartMemRequest={handleHeartMemRequest}
            />
          </InView>
        ) : (
          <MemItemWrapper
            key={mem.id}
            mem={mem}
            user={sessionData}
            handleDeleteMemClick={handleDeleteMemClick}
            displayBorder={i !== mems.length - 1}
            handleHeartMemRequest={handleHeartMemRequest}
          />
        );
      })}
      {allMemsFetched && (
        <div className="w-full text-lg font-bold h-24 flex items-center justify-center p-2">
          No more mems here!
        </div>
      )}
    </div>
  );
}
