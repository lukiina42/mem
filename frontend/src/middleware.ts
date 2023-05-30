import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

//check jwt token every day
const HALF_HOUR = (1440 * 60 * 1000) / 48;

type checkProfileResponseType =
  | {
      authenticationResult: "unauthorized";
    }
  | {
      authenticationResult: "banned";
    }
  | {
      authenticationResult: "ok";
      jwtLastCheck: string;
    };

const checkProfileJwt = async (
  req: NextRequestWithAuth
): Promise<checkProfileResponseType> => {
  const lastCheck: string | undefined = req.cookies.get("jwtLastCheck")?.value;
  const sessionToken = req.cookies.get("next-auth.session-token");

  //on localhost this saves around 20ms :)
  if (
    lastCheck &&
    //@ts-ignore
    new Date() - new Date(lastCheck) < HALF_HOUR &&
    sessionToken
  ) {
    return {
      authenticationResult: "ok",
      jwtLastCheck: lastCheck,
    };
  }

  const token = await getToken({ req });
  if (!token)
    return {
      authenticationResult: "unauthorized",
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
        authenticationResult: "ok",
        jwtLastCheck: new Date().toString(),
      };
    case 401:
      return {
        authenticationResult: "unauthorized",
      };
    case 403:
      return {
        authenticationResult: "banned",
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

    if (userJwtValid.authenticationResult == "banned") {
      let res = NextResponse.redirect(new URL("/banned", req.url));
      return res;
    }

    if (isAuthPage) {
      let res;
      switch (userJwtValid.authenticationResult) {
        case "ok":
          res = NextResponse.redirect(new URL("/home", req.url));
          res.cookies.set("jwtLastCheck", userJwtValid.jwtLastCheck);
          console.log("setting cookies");

          return res;
        case "unauthorized":
          for (let i = 0; i < protectedRoutes.length; i++) {
            const route = protectedRoutes[i];
            if (req.nextUrl.pathname.startsWith(route)) {
              return NextResponse.redirect(process.env.HOME_URL as string);
            }
          }
      }

      return null;
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
