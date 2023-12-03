'use client'

import Link from 'next/link';
import React from 'react';
import HeaderWrapper from '@/clientComponents/header/sidebarLinks/HeaderWrapper';
import Profile from "@/clientComponents/header/profileSettings/ProfileSettings";
import {usePathname} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {z} from "zod";

const sessionUserSchema = z.object({
  user: z.object({
    email: z.string().email(),
    username: z.string(),
    id: z.number(),
    isBanned: z.boolean(),
    roles: z.array(z.string()),
  }),
  token: z.string(),
});

    const isAuthPage = (url: string | null) =>
      url === '/login' ||
      url === '/signup' ||
      url === '/';

export default function Header() {
  const location = usePathname()

  const sessionDataUnavailable = isAuthPage(location)

  const {data: userData} = useQuery({
    queryKey: ['userData', location],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/api/session', {

      })
      const data = await res.json()
      return sessionUserSchema.parse(data)
    },
    enabled: !sessionDataUnavailable,
  })

  return (
    <>
      <nav className="grow shadow-xl max-h-full flex flex-col justify-start items-end @container min-w-[64px] gap-12">
        <div className="flex flex-col gap-5 mt-5">
          <Link href="/home">
            <div className="ml-4 w-full flex justify-center">
              <div className="relative @[200px]:h-[64px] @[200px]:w-[64px] w-[50px] h-[50px] mr-4">
                <img // eslint-disable-line @next/next/no-img-element
                  src="/logo.png"
                  className="w-full"
                  alt="logo"
                />
              </div>
            </div>
          </Link>
          <div className="mr-5 flex flex-col gap-4">
            {userData !== undefined && <HeaderWrapper userData={userData} />}
            <Profile userData={userData ?? null} />
          </div>
        </div>
      </nav>
    </>
  );
}
