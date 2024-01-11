import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Navbar from "./(shared)/Navbar";
import Footer from "./(shared)/Footer";
import SessionProvider from "./SessionProvider";
import { Toaster } from 'react-hot-toast'
import Provider from "./ThemeProvder";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blog AI App",
  description: "Built in Next JS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={openSans.className} suppressHydrationWarning={true}>
        <Provider>
          <SessionProvider>
            <Toaster position="bottom-right" toastOptions={{
              duration: 4000,
              success: {
                style: {
                  background: '#7F7F7F',
                  color: '#fff',
                  padding: '1rem',
                  fontSize: '1rem',
                  lineHeight: '20px'
                },
              },
              error: {
                style: {
                  background: '#e2dbdb',
                  color: '#fb2828',
                  padding: '1rem',
                  fontSize: '1rem',
                  lineHeight: '20px',
                }
              }
            }} />
            <Navbar />
            {children}
            <Footer />
          </SessionProvider>
        </Provider>
      </body>
    </html>
  );
}
