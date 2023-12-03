// import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
// import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
// import { NextResponse } from 'next/server';
import { NextResponse } from 'next/server';
import { SessionUser } from '@/app/api/login/route';
import { getSession } from '@/lib/session';

//check jwt token every day
const HALF_HOUR = (1440 * 60 * 1000) / 48;

type checkProfileResponseType =
  | {
      authenticationResult: 'unauthorized';
    }
  | {
      authenticationResult: 'banned';
    }
  | {
      authenticationResult: 'ok';
      jwtLastCheck: string;
    };

const checkProfileJwt = async (
  req: NextRequest,
  sessionData: SessionUser | null
): Promise<checkProfileResponseType> => {
  const lastCheck: string | undefined = req.cookies.get('jwtLastCheck')?.value;

  if (!sessionData) {
    return {
      authenticationResult: 'unauthorized',
    };
  }

  if (
    lastCheck !== undefined &&
    //@ts-ignore
    new Date() - new Date(lastCheck) < HALF_HOUR
  ) {
    return {
      authenticationResult: 'ok',
      jwtLastCheck: lastCheck,
    };
  }

  const jwtResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/auth/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionData.token}`,
    },
  });
  switch (jwtResponse.status) {
    case 200:
      return {
        authenticationResult: 'ok',
        jwtLastCheck: new Date().toString(),
      };
    case 401:
      return {
        authenticationResult: 'unauthorized',
      };
    case 403:
      return {
        authenticationResult: 'banned',
      };
    default:
      throw new Error(`Something went wrong while checking user JWT, ${jwtResponse.status}`);
  }
};

export async function middleware(req: NextRequest, res: NextResponse) {
  const protectedRoutes = ['/home', '/notifications', '/bookmarks', '/user'];

  const sessionData = await getSession();
  const sessionDataEncrypted = req.cookies.get('auth-session');

  const userJwtValid = await checkProfileJwt(req, sessionData);

  const isAuthPage =
    req.nextUrl.pathname === '/login' ||
    req.nextUrl.pathname === '/signup' ||
    req.nextUrl.pathname === '/';

  if (userJwtValid.authenticationResult == 'banned') {
    return NextResponse.redirect(new URL('/banned', req.url));
  }

  if (isAuthPage && userJwtValid.authenticationResult === 'ok') {
    let res = NextResponse.redirect(new URL('/home', req.url));
    res.cookies.set('auth-session', sessionDataEncrypted!.value);
    return res;
  } else if (!isAuthPage && userJwtValid.authenticationResult === 'unauthorized') {
    for (let i = 0; i < protectedRoutes.length; i++) {
      const route = protectedRoutes[i];
      if (req.nextUrl.pathname.startsWith(route)) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
    return null;
  } else if (req.nextUrl.pathname === '/' && userJwtValid.authenticationResult === 'unauthorized') {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/home', '/login', '/signup', '/notifications', '/bookmarks', '/user/:id*', '/'],
};
