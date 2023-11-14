import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default async function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Main part of the page</h1>
    </>
  );
}
