import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import  Provider  from "@/app/redux/Provider";
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from "react-hot-toast";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DailyMe - BloggingSite",
  description: "A Blogging Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
            <Provider>
              <Toaster
                  position="top-right"
                  toastOptions={{
                    success: {
                      style: {
                        background: 'green',
                        color: 'white',
                      },
                    },
                    error: {
                      style: {
                        background: 'red',
                        color: 'white',
                      },
                    },
                  }}
                />
            {children}
            <Analytics />

        </Provider>
      </body>
    </html>
  );
}
