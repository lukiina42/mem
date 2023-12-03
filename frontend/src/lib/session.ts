import { unsealData } from 'iron-session';
import { sealData } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionUser } from '@/app/api/login/route';
import { z } from 'zod';

const sessionPassword = process.env.SESSION_PASSWORD as string;
if (!sessionPassword) throw new Error('SESSION_PASSWORD is not set');

export const sessionUserSchema = z.object({
  user: z.object({
    email: z.string().email(),
    username: z.string(),
    id: z.number(),
    isBanned: z.boolean(),
    roles: z.array(z.string()),
  }),
  token: z.string(),
});

export async function getSession(): Promise<SessionUser | null> {
  const encryptedSession = cookies().get('auth-session')?.value;

  const session = encryptedSession
    ? ((await unsealData(encryptedSession, {
        password: sessionPassword,
      })) as string)
    : null;

  return session ? (JSON.parse(session) as SessionUser) : null;
}

export async function encryptSession(user: SessionUser) {
  return await sealData(JSON.stringify(user), {
    password: sessionPassword,
  });
}
