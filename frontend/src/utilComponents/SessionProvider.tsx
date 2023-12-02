'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/reactQuery/queryClient';
import QueryProvider from "@/lib/reactQuery/QueryProvider";
interface Props {
  children: ReactNode;
}

const Provider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </SessionProvider>
  );
};

export default Provider;
