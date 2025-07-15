import type { Metadata } from "next";
import "./globals.css";
import  Provider  from "@/app/redux/Provider";
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from "react-hot-toast";
import Link from "next/link";


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
      <head>
      <Link
          href="https://fonts.googleapis.com/css2?family=Borel&family=Delius+Swash+Caps&family=Indie+Flower&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
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
