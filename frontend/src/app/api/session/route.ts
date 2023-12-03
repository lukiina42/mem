import { NextResponse } from 'next/server';
import { z } from 'zod';
import { encryptSession, getSession } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET(request: Request, res: NextResponse) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const decryptedSession = await getSession();

  return NextResponse.json(decryptedSession);
}
