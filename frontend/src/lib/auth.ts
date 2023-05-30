import { NextApiRequest, NextApiResponse } from "next";
import { SessionStrategy, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const AuthOptions = (req: NextApiRequest, res: NextApiResponse) => {
  return {
    session: {
      strategy: "jwt" as SessionStrategy,
    },
    providers: [
      //@ts-ignore
      CredentialsProvider({
        name: "credentials",
        //@ts-ignore
        async authorize(credentials, req) {
          if (!credentials) return;
          const response = await fetch(`http://localhost:8080/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.email,
              password: credentials.password,
            }),
          });
          const userData = await response.json();

          const user: User = {
            email: userData.user.email,
            name: userData.user.username,
            id: userData.user.id.toString(),
            token: userData.token,
            roles: userData.user.roles,
          };

          res.setHeader("Set-Cookie", [
            `next-auth.session-token=${userData.token}`,
          ]);

          return user;
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }: any) {
        if (user) {
          token.token = user.token;
          token.roles = user.roles;
        }
        return token;
      },
      session({ session, token }: any) {
        if (token && session.user) {
          session.user.token = token.token;
          session.user.id = token.sub;
          session.user.roles = token.roles;
        }
        return session;
      },
      // async signIn({ user, email, password, credentials }) {
      //   // Check if this sign in callback is being called in the credentials authentication flow. If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).

      //   if (user) {
      //     // const cookies = new Cookies(req, res);
      //     // cookies.set("next-auth.session-token", user.token, {
      //     //   expires: sessionExpiry,
      //     // });
      //     // console.log(cookies);
      //   }

      //   return true;
      // },
    },
    pages: {
      signIn: "/",
      error: "/",
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
};
