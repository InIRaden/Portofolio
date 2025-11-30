'use client';

import { JetBrains_Mono } from  'next/font/google';
import localFont from 'next/font/local';
import "./globals.css";
import { usePathname } from 'next/navigation';

//component
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import StairTransition from '@/components/StairTransition';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  preload: true,
  weight: ["100","200","300","400","500","600","700","800"],
  variable: '--font-jetbrainsMono',
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${jetbrainsMono.variable} antialiased`}>
        {!isAdminRoute && <Header />}
        {!isAdminRoute && <StairTransition />}
        {!isAdminRoute ? (
          <PageTransition>{children}</PageTransition>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
