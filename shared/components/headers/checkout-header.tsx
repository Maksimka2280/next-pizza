'use client'
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { LoginWindow } from "../Auth/Login";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";


export default function CheckOutHeader() {
    const [openAuth, setOpenAuth] = useState<"login" | "register" | null>(null)
    const { data: session, status } = useSession();
    const openLoginFunction = () => {
        setOpenAuth("login");
    }
    const closeLoginFunction = () => {
        setOpenAuth(null);
    }
    return (
        <>
            <header className="profile-layout-header sticky top-0 z-50 flex w-full items-center justify-center border-b border-[#EDEDED] px-6 py-4 backdrop-blur-md sm:px-[67px] sm:py-[25px]">
                <div className="flex items-center justify-between w-full max-w-[1440px] ">
                    <Link className="flex items-center gap-4 " href="/">
                        <img src="/img/header/pizza-logo.png" alt="Pizza Logo" className="w-25 h-25" />
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black uppercase">next pizza</h1>
                            <p className="text-[16px] text-[#7B7B7B] leading-none dark:text-zinc-400">вкусней уже некуда</p>
                        </div>
                    </Link>
                    <div className=" flex items-center gap-4 ">
                        {status === 'unauthenticated' ? (
                            <Button
                                className="text-[#FE5F00] w-[110px] h-[50px] rounded-[15px] text-[16px] font-semibold"
                                variant="outline"
                                onClick={openLoginFunction}
                            >
                                <User strokeWidth={3} />
                                Войти
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