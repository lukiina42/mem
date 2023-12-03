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
  const data = await request.json();
  let parsedData;

  try {
    parsedData = loginSchema.parse(data);
  } catch (e) {
    console.log(e);
    return new Response('Wrong data format sent', { status: 400 });
  }

  const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: parsedData.email,
      password: parsedData.password,
    }),
  });

  if (loginResponse.status === 401) {
    return new Response('Wrong email or password', { status: 401 });
  }

  const userData = await loginResponse.json();

  const user = sessionUserSchema.parse(userData);

  const encryptedSession = await encryptSession(user);

  cookies().set('auth-session', encryptedSession);
  return new Response('Login successful', { status: 201 });
}
