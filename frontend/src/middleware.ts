import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

//this is not working because each time the middleware is called this is reset, I dunno how else to do it xd
let lastSuccessfulCheck = new Date("1970");

//check jwt token every day
const ONE_DAY = 1440 * 60 * 1000;

const checkProfileJwt = async (req: NextRequestWithAuth) => {
  const newDate = new Date();
  //@ts-ignore
  if (newDate - lastSuccessfulCheck < ONE_DAY) {
    console.log(true);
    return true;
  }

  const token = await getToken({ req });
  if (!token) return false;
  const jwtResponse = await fetch("http://localhost:8080/auth/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token?.token}`,
    },
    next: { revalidate: 84000 },
  });
  switch (jwtResponse.status) {
    case 200:
      return true;
    case 401:
      return false;
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
      if (userJwtValid) {
        return NextResponse.redirect(new URL("/home", req.url));
      }

      return null;
    }

    if (!userJwtValid) {
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
