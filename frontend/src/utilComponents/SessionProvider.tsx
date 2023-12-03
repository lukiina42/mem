'use client';

import { ReactNode } from 'react';
import QueryProvider from '@/lib/reactQuery/QueryProvider';
interface Props {
  children: ReactNode;
}

const Provider = ({ children }: Props) => {
  return <QueryProvider>{children}</QueryProvider>;
};

export default Provider;
