import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

//check jwt token every day
const ONE_DAY = 1440 * 60 * 1000;

type checkProfileResponseType =
  | {
      isAuthenticated: false;
    }
  | {
      isAuthenticated: true;
      jwtLastCheck: string;
    };

const checkProfileJwt = async (
  req: NextRequestWithAuth
): Promise<checkProfileResponseType> => {
  const lastCheck: string | undefined = req.cookies.get("jwtLastCheck")?.value;
  const sessionToken = req.cookies.get("next-auth.session-token");

  //on localhost this saves around 20ms :)
  //@ts-ignore
  if (lastCheck && new Date() - new Date(lastCheck) < ONE_DAY && sessionToken) {
    return {
      isAuthenticated: true,
      jwtLastCheck: lastCheck,
    };
  }

  const token = await getToken({ req });
  if (!token)
    return {
      isAuthenticated: false,
    };
  const jwtResponse = await fetch("http://localhost:8080/auth/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token?.token}`,
    },
  });
  switch (jwtResponse.status) {
    case 200:
      return {
        isAuthenticated: true,
        jwtLastCheck: new Date().toString(),
      };
    case 401:
      return {
        isAuthenticated: false,
      };
    default:
      throw new Error(
        `Something went wrong while checking user JWT, ${jwtResponse.status}`
      );
  }
};

export default withAuth(
  async function middleware(req) {
    const protectedRoutes = ["/home", "/notifications", "/bookmarks"];
    const userJwtValid = await checkProfileJwt(req);
    const isAuthPage = req.nextUrl.pathname === "/";

    if (isAuthPage) {
      if (userJwtValid.isAuthenticated) {
        const res = NextResponse.redirect(new URL("/home", req.url));
        res.cookies.set("jwtLastCheck", userJwtValid.jwtLastCheck);
        return res;
      }

      return null;
    }

    if (!userJwtValid.isAuthenticated) {
      for (let i = 0; i < protectedRoutes.length; i++) {
        const route = protectedRoutes[i];
        if (req.nextUrl.pathname.startsWith(route)) {
          return NextResponse.redirect(process.env.HOME_URL as string);
        }
      }
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/home", "/notifications", "/bookmarks", "/"],
};
