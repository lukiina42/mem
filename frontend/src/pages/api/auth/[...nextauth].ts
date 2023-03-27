import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    //@ts-ignore
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials, req) {
        console.log("Authorize", credentials);
        const response = await fetch(`http://localhost:8080/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        const data = await response.json();

        return data;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
