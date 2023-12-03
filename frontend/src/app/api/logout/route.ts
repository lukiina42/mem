import { NextResponse } from 'next/server';
import { z } from 'zod';
import { encryptSession, sessionUserSchema } from '@/lib/session';
import { cookies } from 'next/headers';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SessionUser = z.infer<typeof sessionUserSchema>;

export async function POST(request: Request, res: NextResponse) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const response = NextResponse.json({ message: 'Logged out!' });
  response.cookies.delete('auth-session');
  cookies().delete('auth-session');
  return response;
}
