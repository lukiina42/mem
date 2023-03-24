import "./globals.css";

import Header from "./components/Header";

export const metadata = {
  title: "Twitter FE clone",
  description:
    "An app imitating twitter, new technologies are used to practice them",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
}
