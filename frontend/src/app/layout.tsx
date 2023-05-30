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
  return (
    <html lang="en">
      <body>
        <main className="h-screen w-screen flex flex-row">
          <Header userData={data} />
          <div className="lg:max-w-[50rem] lg:min-w-[50rem] min-w-0 w-3/4">
            {children}
          </div>
          <div className="grow hidden lg:block">The right sidebar</div>
        </main>
      </body>
    </html>
  );
}
