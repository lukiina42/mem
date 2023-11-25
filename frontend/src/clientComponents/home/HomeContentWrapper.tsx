'use client';

import { ToastContainer } from 'react-toastify';

import HomeContent from './HomeContent';
import QueryProvider from '@/lib/reactQuery/QueryProvider';
import { DefaultHomeProps } from '@/app/home/@main/page';

export default function HomeContentWrapper({
  mems,
  sessionData,
  isUserFollowingAnyone,
}: DefaultHomeProps) {
  return (
    <>
      <QueryProvider>
        <HomeContent
          mems={mems}
          sessionData={sessionData}
          isUserFollowingAnyone={isUserFollowingAnyone}
        />
      </QueryProvider>
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
