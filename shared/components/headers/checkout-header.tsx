'use client'
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { LoginWindow } from "../Auth/Login";
import { useState } from "react";


export default function CheckOutHeader() {
    const [openAuth, setOpenAuth] = useState<"login" | "register" | null>(null)
    const openLoginFunction = () => {
        setOpenAuth("login");
    }
    const closeLoginFunction = () => {
        setOpenAuth(null);
    }
    return (
        <>
            <header className="flex items-center  justify-center w-full px-[67px] py-[25px] sticky top-0 z-50  backdrop-blur-xs">
                <div className="flex items-center justify-between w-full max-w-[1440px] ">
                    <a className="flex items-center gap-4 " href="/">
                        <img src="/img/header/pizza-logo.png" alt="Pizza Logo" className="w-25 h-25" />
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black uppercase">next pizza</h1>
                            <p className="text-[16px] text-[#7B7B7B] leading-none">вкусней уже некуда</p>
                        </div>
                    </a>
                    <div className=" flex items-center gap-4 ">
                        <Button className="text-[#FE5F00] w-[110px] h-[50px] rounded-[15px] text-[16px] font-semibold" variant="outline" onClick={openLoginFunction}>
                            <User strokeWidth={3} /> Войти
                        </Button>
                    </div>
                </div>
            </header>
            <div className="w-full  bg-[#EDEDED] h-[2px]"></div>
            {openAuth === "login" && (
                <LoginWindow
                    onRegister={() => setOpenAuth("register")}
                    onClose={closeLoginFunction}
                />
            )}
        </>

    )
}