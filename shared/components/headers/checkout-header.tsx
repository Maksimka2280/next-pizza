'use client'
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { LoginWindow } from "../Auth/Login";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MobileHeaderMenu } from "./MobileHeaderMenu";
import Image from "next/image";


export default function CheckOutHeader() {
    const [openAuth, setOpenAuth] = useState<"login" | "register" | null>(null)
    const { status } = useSession();
    const openLoginFunction = () => {
        setOpenAuth("login");
    }
    const closeLoginFunction = () => {
        setOpenAuth(null);
    }
    return (
        <>
            <header className="profile-layout-header sticky top-0 z-50 flex w-full items-center justify-center border-b border-[#EDEDED] px-3 py-2 backdrop-blur-md sm:px-5 sm:py-3 lg:px-[67px] lg:py-[25px]">
                <div className="flex w-full max-w-[1440px] items-center justify-between">
                    <Link className="flex min-w-0 items-center gap-2 sm:gap-4" href="/">
                        <Image src="/img/header/pizza-logo.png" alt="Pizza Logo" width={100} height={100} priority className="h-12 w-12 sm:h-16 sm:w-16 lg:h-25 lg:w-25" />
                        <div className="flex flex-col">
                            <h1 className="text-base font-black uppercase sm:text-xl lg:text-2xl">next pizza</h1>
                            <p className="hidden text-[16px] leading-none text-[#7B7B7B] dark:text-zinc-400 sm:block">вкусней уже некуда</p>
                        </div>
                    </Link>
                    <div className=" flex items-center gap-4 ">
                        <MobileHeaderMenu
                            isAuthenticated={status === "authenticated"}
                            onLogin={openLoginFunction}
                        />
                        {status === 'unauthenticated' ? (
                            <Button
                                className="hidden h-[50px] w-[110px] rounded-[15px] p-2.5 text-[16px] font-semibold text-[#FE5F00] sm:flex"
                                variant="outline"
                                onClick={openLoginFunction}
                            >
                                <User strokeWidth={3} />
                                <span className="hidden sm:inline">Войти</span>
                            </Button>
                        ) : null}
                    </div>
                </div>
            </header>
            {openAuth === "login" && (
                <LoginWindow
                    onRegister={() => setOpenAuth("register")}
                    onClose={closeLoginFunction}
                />
            )}
        </>

    )
}