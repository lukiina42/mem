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
          <div className="overflow-y-auto xl:w-[65%] w-[80%]">{children}</div>
        </main>
      </body>
    </html>
  );
}
