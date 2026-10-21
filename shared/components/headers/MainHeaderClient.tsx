
'use client';

import { Button } from "../ui/button";
import { ListOrdered, ShoppingCart, User } from "lucide-react";
import { SearchInput } from "../SearchInput";
import { Cart } from "../shared/Cart";
import { useState } from "react";
import Link from "next/link";
import { LoginWindow } from "../Auth/Login";
import { RegisterWindow } from "../Auth/Register";

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
            <header className="sticky top-0 z-50 flex w-full items-center justify-center bg-white/70 px-[67px] py-[25px] backdrop-blur-xs">
                <div className="flex w-full max-w-[1440px] items-center">
                    <Link
                        className="flex shrink-0 items-center gap-4"
                        href="/"
                    >
                        <img
                            src="/img/header/pizza-logo.png"
                            alt="Pizza Logo"
                            className="h-25 w-25"
                        />

                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black uppercase">
                                next pizza
                            </h1>
                            <p className="text-[16px] leading-none text-[#7B7B7B]">
                                вкусней уже некуда
                            </p>
                        </div>
                    </Link>

                    <div className="flex flex-1 justify-center px-6">
                        <div className="flex h-[50px] w-full max-w-[760px] items-center">
                            <SearchInput />
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-4">
                        {!isAuthenticated && (
                            <Button
                                className="h-[50px] w-[110px] rounded-[15px] text-[16px] font-semibold text-[#FE5F00]"
                                variant="outline"
                                onClick={openLoginFunction}
                            >
                                <User strokeWidth={3} />
                                Войти
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            className="h-[50px] w-[50px] rounded-[15px] text-[#FE5F00]"
                            onClick={openCart}
                        >
                            <ShoppingCart strokeWidth={3} />
                        </Button>

                        <Link href="/orders">
                            <Button
                                variant="outline"
                                className="h-[50px] w-[50px] rounded-[15px] text-[#FE5F00]"
                            >
                                <ListOrdered strokeWidth={3} />
                            </Button>
                        </Link>
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

            <div className="h-[1px] w-full bg-[#EDEDED]" />
        </>
    );
}
