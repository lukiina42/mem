import { getSession } from "@/lib/session";
import Header from "./Header";
import "./globals.css";
import { retrieveCookiesSession } from "@/serverApiCalls/retrieveCookiesSession";

export const metadata = {
  title: "Mem!",
  description: "Very mem yes, very mem",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await retrieveCookiesSession();
  console.log("userSession data", data);
  return (
    <html lang="en">
      <body>
        <main className="h-screen w-screen flex flex-row overflow-hidden">
          <Header />
          <div className="lg:max-w-[50rem] lg:min-w-[50rem] min-w-0 w-3/4">
            {children}
          </div>
          <div className="grow hidden lg:block">The right sidebar</div>
        </main>
      </body>
    </html>
  );
}
