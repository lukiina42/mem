'use client';

import { useState } from 'react';
import MemsContainer from './memsContainer/MemsContainer';
import NewMemForm from './newMemForm/NewMemForm';
import { getMems } from '@/clientApiCalls/memApi';
import MemType from './memTypeButton/MemTypeButton';
import { DefaultHomeProps } from '@/app/home/@main/page';
import { useQuery } from '@tanstack/react-query';

export default function HomeContent({
  mems,
  sessionData,
  isUserFollowingAnyone,
}: DefaultHomeProps) {
  const { data: newestMems, isLoading } = useQuery({
    queryKey: ['newMems'],
    queryFn: () =>
      getMems({
        token: sessionData!.token,
        requestUrl: '/home/newest',
        from: 0,
        to: 9,
      }),
  });

  const [memsType, setMemsType] = useState<'Following' | 'Newest'>(
    isUserFollowingAnyone ? 'Following' : 'Newest'
  );

  const handleMemsTypeChange = (type: 'Following' | 'Newest') => {
    if (type == 'Following' && !isUserFollowingAnyone) return;

    setMemsType(type);
  };

  return (
    <>
      <div className="w-full flex flex-col bg-white top-0">
        <NewMemForm />
      </div>
      <div className="w-full flex bg-white top-0 border-b border-t mt-2">
        <MemType
          memsType="Following"
          handleMemsTypeChange={handleMemsTypeChange}
          isActive={memsType == 'Following'}
          disabled={!isUserFollowingAnyone}
        />
        <MemType
          memsType="Newest"
          handleMemsTypeChange={handleMemsTypeChange}
          isActive={memsType == 'Newest'}
          disabled={isLoading}
        />
      </div>
      <div className="w-full flex flex-col justify-center items-center pb-b">
        <MemsContainer
          sessionData={sessionData}
          requestUrl={memsType == 'Following' ? '/' : '/home/newest'}
          mems={memsType == 'Following' || !isUserFollowingAnyone ? mems : newestMems!}
        />
      </div>
    </>
  );
}
