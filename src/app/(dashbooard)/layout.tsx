import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Панель управления — Next Pizza",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}