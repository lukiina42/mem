import { SessionStrategy, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const AuthOptions = {
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
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.token = user.token;
      }
      return token;
    },
    session({ session, token }: any) {
      if (token && session.user) {
        session.user.token = token.token;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
