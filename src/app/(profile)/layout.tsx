import type { Metadata } from "next";
import CheckOutHeader from "../../../shared/components/headers/checkout-header";
import { SidebarProvider, SidebarTrigger } from "../../../shared/components/ui/sidebar";
import { ProfileSidebar } from "../../../shared/components/ProfileComponents/ProfileSidebar";


export const metadata: Metadata = {
    title: "Next-Pizza - страница заказов",
};

export default function DashboardLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-svh bg-[#F4F1EE]">
            <CheckOutHeader />

            <SidebarProvider
                style={{
                    "--sidebar-width-icon": "5rem",
                } as React.CSSProperties}
            >
                <ProfileSidebar />

                <main className="min-w-0 flex-1 p-6">
                    {/* <SidebarTrigger /> */}
                    {children}
                    
                </main>
            </SidebarProvider>
        </div>
    );
}