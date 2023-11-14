import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';

export const retrieveCookiesSession = async () => {
  //getServerSession from next auth returns only name and email, even though in callbacks I have specified it should return the token and id as well
  return await decode({
    token: cookies().get('next-auth.session-token')?.value,
    secret: process.env.NEXTAUTH_SECRET!,
  });
};
