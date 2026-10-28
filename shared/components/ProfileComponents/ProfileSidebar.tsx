
"use client";

import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
    useSidebar,
} from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { Bell, Bookmark, Heart, Settings, SquareArrowRightExit, User } from "lucide-react";
import { signOut } from "next-auth/react";

type MenuItem = {
    img: React.ReactNode;
    title: string;
    url?: string;
    onClick?: () => void | Promise<unknown>;
};

const menuItems: MenuItem[] = [
    { img: <User />, title: "Мой профиль", url: "/profile" },
    { img: <Heart />, title: "Мои заказы", url: "/profile/orders" },
    { img: <Bookmark />, title: "Избранное", url: "/profile/favorites" },
    { img: <Bell />, title: "Уведомления", url: "/profile/notifications" },
    { img: <Settings />, title: "Настройки", url: "/profile/settings" },
    {
        img: <SquareArrowRightExit />,
        title: "Выйти",
        onClick: () => signOut({ callbackUrl: "/" }),
    },
];


export function ProfileSidebar() {
    const pathname = usePathname()
    return (
        <div>

            <Sidebar className="mt-[150px]" collapsible="icon">

                <SidebarContent className="p-[10px] group-data-[collapsible=icon]:p-0">

                    <div className="flex justify-end group-data-[collapsible=icon]:justify-center text-[#707070]">
                        <SidebarTrigger />
                    </div>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-[20px] group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center rounded-[15px] border p-[10px] group-data-[collapsible=icon]:p-[4px] group-data-[collapsible=icon]:border-none">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.url;

                                  return (
    <SidebarMenuItem key={item.url ?? item.title}>
        <SidebarMenuButton
            
            isActive={isActive}
            tooltip={item.title}
            className={`h-[48px] min-h-[48px] rounded-[12px] px-4 py-3 text-[16px] text-[#707070]
                group-data-[collapsible=icon]:!size-[48px]
                group-data-[collapsible=icon]:!min-h-[48px]
                group-data-[collapsible=icon]:!p-0
                group-data-[collapsible=icon]:!mx-auto
                group-data-[collapsible=icon]:justify-center
                ${
                    isActive
                        ? "!bg-[#FFF0E7] !text-[#FF6900] hover:!bg-[#FFF0E7] hover:!text-[#FF6900]"
                        : "hover:bg-[#FFF0E7] hover:text-[#FF6900]"
                }`}
        >
            {item.onClick ? (
                <button
                    type="button"
                    onClick={item.onClick}
                    className="flex w-full items-center gap-[10px]"
                >
                    <span className="flex shrink-0 items-center justify-center [&_svg]:size-[22px] [&_svg]:stroke-[2.5px]">
                        {item.img}
                    </span>

                    <span className="truncate text-[15px] font-semibold group-data-[collapsible=icon]:hidden">
                        {item.title}
                    </span>
                </button>
            ) : (
                <Link
                    href={item.url!}
                    className="flex items-center gap-[10px]"
                >
                    <span className="flex shrink-0 items-center justify-center [&_svg]:size-[22px] [&_svg]:stroke-[2.5px]">
                        {item.img}
                    </span>

                    <span className="truncate text-[15px] font-semibold group-data-[collapsible=icon]:hidden">
                        {item.title}
                    </span>
                </Link>
            )}
        </SidebarMenuButton>
    </SidebarMenuItem>
);
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </div>

    );
}
