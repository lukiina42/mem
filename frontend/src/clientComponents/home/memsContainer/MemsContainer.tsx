'use client';

import { Mem } from '@/types/mem';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMem, getMems } from '@/clientApiCalls/memApi';
import ConfirmationModal from '@/utilComponents/ConfirmationModal';
import React from 'react';
import { displayToast } from '@/utilComponents/toast';
import MemItemWrapper from './memItem/MemItemWrapper';
import { useHeartMutation } from '@/clientApiCalls/reactQuery/heartMutation';
import { InView } from 'react-intersection-observer';
import { QueryKeys } from '@/types/queryKeys';
import LoadingSpinner from '@/utilComponents/Loading';
import { SessionUser } from '@/app/api/login/route';

export default function MemsContainer({
  mems,
  requestUrl,
  requestingUserId,
  sessionData,
}: {
  mems: Mem[];
  requestUrl: '/mems/home/newest' | '/' | string;
  requestingUserId?: number;
  sessionData: SessionUser;
}) {
  const getMemsFunction = async (pageParam: number) => {
    const data = await getMems({
      token: sessionData.token,
      requestUrl,
      from: pageParam,
      to: pageParam + 9,
      requestingUser: requestUrl.startsWith('/user') ? requestingUserId?.toString() : '',
    });
    let dataConverted: Mem[];
    //the home api call returns the mems in an object
    if ('mems' in data) {
      dataConverted = data.mems as Mem[];
    } else {
      dataConverted = data;
    }
    return dataConverted;
  };

  const queryClient = useQueryClient();

  //continue here - pass the current number from which to fetch
  const {
    data: memsFromQuery,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [...QueryKeys.memsPaginationQueryKey, requestUrl],
    queryFn: async ({ pageParam = 0 }) => getMemsFunction(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length < 9 ? undefined : allPages?.flat().length,
    initialData: {
      pageParams: [undefined, 1],
      pages: [mems],
    },
  });

  const handleSecondToLastMemInView = () => {
    if (hasNextPage) fetchNextPage();
  };

  ////delete mem
  const [memIdToDelete, setMemIdToDelete] = React.useState(0);

  const deleteMemMutation = useMutation({
    mutationFn: deleteMem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [...QueryKeys.memsPaginationQueryKey, '/'] });
      await queryClient.invalidateQueries({
        queryKey: [...QueryKeys.memsPaginationQueryKey, '/home/newest'],
      });
      displayToast('The mem was successfully deleted', 'bottom-center', 'success');
    },
    onError: () => {
      displayToast('Something went wrong, please try again', 'bottom-center', 'error');
    },
  });

  const handleDeleteMemClick = (id: number) => setMemIdToDelete(id);

  const handleDeleteMem = () => {
    deleteMemMutation.mutate({
      memId: memIdToDelete,
      token: sessionData.token,
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
      displayToast('You must be logged in to do that xd', 'bottom-center', 'info');
    } else {
      heartMemMutation.mutate({ memId, token: sessionData!.token });
    }
  };

  const allMems = memsFromQuery?.pages?.flat();

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
      {allMems.map((mem, i) => {
        return i == allMems.length - 2 ? (
          <InView key={mem.id} as="div" onChange={handleSecondToLastMemInView}>
            <MemItemWrapper
              key={mem.id}
              mem={mem}
              sessionData={sessionData}
              handleDeleteMemClick={handleDeleteMemClick}
              displayBorder={i !== allMems.length - 1}
              handleHeartMemRequest={handleHeartMemRequest}
              enableDelete={sessionData?.user.roles.some((role) => role == 'admin')}
            />
          </InView>
        ) : (
          <MemItemWrapper
            key={mem.id}
            mem={mem}
            sessionData={sessionData}
            handleDeleteMemClick={handleDeleteMemClick}
            displayBorder={i !== allMems.length - 1}
            handleHeartMemRequest={handleHeartMemRequest}
            enableDelete={sessionData?.user.roles.some((role) => role == 'admin')}
          />
        );
      })}

      <div className="w-full text-lg font-bold h-24 flex items-center justify-center p-2">
        {!hasNextPage ? (
          'No more mems here!'
        ) : (
          <button
            className="basic-button w-32 h-10 flex justify-center items-center"
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? <LoadingSpinner /> : 'Load more'}
          </button>
        )}
      </div>
    </div>
  );
}
