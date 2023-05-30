import { getServerSession } from "next-auth";

export async function getCurrentUser() {
  const session = await getServerSession();

  console.log("Session obtained");

  return session?.user;
}
