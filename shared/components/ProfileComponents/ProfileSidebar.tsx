
"use client";

import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
} from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { Bookmark, Heart, Settings, ShieldPlus, SquareArrowRightExit, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

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
    { img: <Settings />, title: "Настройки", url: "/profile/settings" },
    {
        img: <SquareArrowRightExit />,
        title: "Выйти",
        onClick: () => signOut({ callbackUrl: "/" }),
    },
];


export function ProfileSidebar() {
    const pathname = usePathname()
    const { data: session } = useSession();
    const adminMenuItem: MenuItem = {
        img: <ShieldPlus />,
        title: "Добавить товар",
        url: "/profile/admin/products",
    };
    const visibleMenuItems: MenuItem[] = session?.user?.role === "ADMIN"
        ? [...menuItems.slice(0, 3), adminMenuItem, ...menuItems.slice(3)]
        : menuItems;

    return (
        <div>

            <Sidebar className="mt-0 md:mt-[150px]" collapsible="icon">

                <SidebarContent className="bg-[#F4F1EE] p-[10px] dark:bg-zinc-950 group-data-[collapsible=icon]:p-0">

                    <div className="flex justify-end text-[#707070] dark:text-zinc-300 group-data-[collapsible=icon]:justify-center">
                        <SidebarTrigger />
                    </div>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-[20px] rounded-[15px] border-[2px] border-[#e4e4e4] bg-white p-[10px] shadow-sm dark:border-zinc-700 dark:bg-zinc-900 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:p-[4px]">
                                {visibleMenuItems.map((item) => {
                                    const isActive = item.url === "/profile/admin/products"
                                        ? pathname.startsWith(item.url)
                                        : pathname === item.url;

                                    return (
                                        <SidebarMenuItem key={item.url ?? item.title}>
                                            <SidebarMenuButton
                                                render={item.url ? <Link href={item.url} /> : undefined}
                                                onClick={item.onClick}
                                                isActive={isActive}
                                                tooltip={item.title}
                                                className={`h-[48px] min-h-[48px] rounded-[12px] px-4 py-3 text-[16px] text-[#707070] dark:text-zinc-300
                group-data-[collapsible=icon]:!size-[48px]
                group-data-[collapsible=icon]:!min-h-[48px]
                group-data-[collapsible=icon]:!p-0
                group-data-[collapsible=icon]:!mx-auto
                group-data-[collapsible=icon]:justify-center
                ${isActive
                                                        ? "!bg-[#FFF0E7] !text-[#FF6900] hover:!bg-[#FFF0E7] hover:!text-[#FF6900] dark:!bg-zinc-800 dark:!text-orange-300 dark:hover:!bg-zinc-800"
                                                        : "hover:bg-[#FFF0E7] hover:text-[#FF6900] dark:hover:!bg-zinc-800 dark:hover:!text-orange-300"
                                                    }`}
                                            >
                                                <span className="flex shrink-0 items-center justify-center [&_svg]:size-[22px] [&_svg]:stroke-[2.5px]">
                                                    {item.img}
                                                </span>
                                                <span className="truncate text-[15px] font-semibold group-data-[collapsible=icon]:hidden">
                                                    {item.title}
                                                </span>
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
