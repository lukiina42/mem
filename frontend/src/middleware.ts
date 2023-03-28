import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const protectedRoutes = ["/home", "/notifications", "/bookmarks"];
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname === "/";

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/home", req.url));
      }

      return null;
    }

    if (!isAuth) {
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
