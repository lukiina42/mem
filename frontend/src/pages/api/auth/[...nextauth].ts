import { AuthOptions } from '@/lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';

export default (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, AuthOptions(req, res));
};
