import Header from "./Header";
import "./globals.css";

export const metadata = {
  title: "Mem!",
  description: "Very mem yes, very mem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
