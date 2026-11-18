
'use client';

import { Button } from "../ui/button";
import { ShoppingCart, User } from "lucide-react";
import { SearchInput } from "../SearchInput";
import { Cart } from "../shared/Cart";
import { useState } from "react";
import Link from "next/link";
import { LoginWindow } from "../Auth/Login";
import { RegisterWindow } from "../Auth/Register";
import { MobileHeaderMenu } from "./MobileHeaderMenu";
import Image from "next/image";

type MainHeaderClientProps = {
    isAuthenticated: boolean;
};

export default function MainHeaderClient({
    isAuthenticated,
}: MainHeaderClientProps) {
    const [open, setOpen] = useState(false);
    const [openAuth, setOpenAuth] = useState<"login" | "register" | null>(null);

    const openLoginFunction = () => {
        setOpenAuth("login");
    };

    const closeLoginFunction = () => {
        setOpenAuth(null);
    };

    const openCart = () => {
        setOpen(true);
    };

    const closeCart = () => {
        setOpen(false);
    };

    return (
        <>
            <header className="sticky top-0 z-50 flex w-full items-center justify-center border-b border-[#EDEDED] bg-white/95 px-3 py-2 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950 sm:px-5 sm:py-3 lg:px-[67px] lg:py-[25px]">
                <div className="flex w-full max-w-[1440px] flex-wrap items-center gap-y-2 sm:flex-nowrap">
                    <Link
                        className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-4"
                        href="/"
                    >
                        <Image
                            src="/img/header/pizza-logo.png"
                            alt="Pizza Logo"
                            width={100}
                            height={100}
                            priority
                            className="h-12 w-12 sm:h-16 sm:w-16 lg:h-25 lg:w-25"
                        />

                        <div className="flex flex-col">
                            <h1 className="text-base font-black uppercase sm:text-xl lg:text-2xl">
                                next pizza
                            </h1>
                            <p className="hidden text-[16px] leading-none text-[#7B7B7B] dark:text-zinc-400 sm:block">
                                вкусней уже некуда
                            </p>
                        </div>
                    </Link>

                    <div className="order-3 flex w-full basis-full justify-center px-0 sm:order-none sm:w-auto sm:basis-auto sm:flex-1 sm:px-4 lg:px-6">
                        <div className="flex h-[50px] w-full max-w-[760px] items-center">
                            <SearchInput />
                        </div>
                    </div>

                    <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
                        <MobileHeaderMenu
                            isAuthenticated={isAuthenticated}
                            onLogin={openLoginFunction}
                        />
                        {isAuthenticated && (
                            <Link href={'/profile'}>
                                <Button
                                    variant="outline"
                                    className="hidden h-[50px] w-[130px] rounded-[15px] p-2.5 text-[15px] font-semibold text-[#FE5F00] sm:flex"
                                >
                                    <User className="size-[18px] stroke-[2.5px]" />
                                    <span className="hidden sm:inline">Профиль</span>
                                </Button>
                            </Link>
                        )}
                        {!isAuthenticated && (
                            <Button
                                className="hidden h-[50px] w-[110px] rounded-[15px] p-2.5 text-[16px] font-semibold text-[#FE5F00] sm:flex"
                                variant="outline"
                                onClick={openLoginFunction}
                            >
                                <User strokeWidth={3} />
                                <span className="hidden sm:inline">Войти</span>
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            aria-label="Открыть корзину"
                            className="h-10 w-10 rounded-xl border-[#FE5F00] p-0 text-[#FE5F00] sm:h-[50px] sm:w-[50px] sm:rounded-[15px]"
                            onClick={openCart}
                        >
                            <ShoppingCart strokeWidth={3} />
                        </Button>
                    </div>
                </div>
            </header>

            {open && <Cart onClose={closeCart} />}

            {openAuth === "login" && (
                <LoginWindow
                    onRegister={() => setOpenAuth("register")}
                    onClose={closeLoginFunction}
                />
            )}

            {openAuth === "register" && (
                <RegisterWindow onClose={closeLoginFunction} />
            )}

        </>
    );
}
