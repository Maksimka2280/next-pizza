
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Nunito } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import CookieConsent from '../../shared/components/shared/CookieConsent';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Next Pizza — заказ пиццы и любимых блюд',
  description: 'Заказывайте пиццу, закуски и напитки с доставкой от Next Pizza.',
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <Script id="load-site-preferences" strategy="beforeInteractive">
          {`try {
            var preferences = JSON.parse(localStorage.getItem("next-pizza-preferences") || "{}");
            if (preferences.isDark === true) document.documentElement.classList.add("dark");
            if (preferences.reduceMotion === true) document.documentElement.classList.add("reduce-motion");
          } catch (error) {
            console.error("Не удалось применить сохранённые настройки сайта:", error);
          }`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>

        <CookieConsent />
      </body>
    </html>
  );
}
