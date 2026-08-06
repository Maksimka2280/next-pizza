import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "../globals.css";


export const metadata: Metadata = {
  title: "Create Next App",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}