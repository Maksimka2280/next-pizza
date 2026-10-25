import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import CheckOutHeader from "../../../shared/components/headers/checkout-header";



export const metadata: Metadata = {
    title: "Next-Pizza - страница оплаты",
};

export default function DashboardLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
    <div className="min-h-screen bg-[#F4F1EE]">
        <CheckOutHeader />
            {children}
        </div>
    );
}