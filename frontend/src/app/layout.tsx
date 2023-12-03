import Provider from '@/utilComponents/SessionProvider';
import Header from './Header';
import './globals.css';
import ToastProvider from '@/utilComponents/ToastProvider';
import 'react-toastify/dist/ReactToastify.css';
import { getSession } from '@/lib/session';

export const metadata = {
  title: 'Mem!',
  description: 'Very mem yes, very mem',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="h-screen w-screen flex flex-row">
          <Provider>
            <Header />
            <div className="overflow-y-auto xl:w-[65%] w-[80%]">{children}</div>
          </Provider>
          <ToastProvider />
        </main>
      </body>
    </html>
  );
}
