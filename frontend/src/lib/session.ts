import { getServerSession } from "next-auth/next";

import { AuthOptions } from "@/lib/auth";
import { Session } from "next-auth";

export async function getSession(): Promise<Session | null> {
  return await getServerSession(AuthOptions);
}

export async function getCurrentUser() {
  const session = await getSession();

  console.log("Session obtained");

  return session?.user;
}
