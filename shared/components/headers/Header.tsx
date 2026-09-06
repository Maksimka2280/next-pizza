'use client'
import { Input } from "@base-ui/react/input";
import { Button } from "../ui/button";
import { ShoppingCart, User } from "lucide-react";
import { SearchInput } from "../SearchInput";
import { Cart } from "../shared/Cart";
import { useState } from "react";

export default function Header() {

    const [open, setOpen] = useState(false)
    const openCart = () => {
        setOpen(true);
    };

    const closeCart = () => {
        setOpen(false);
    };
    return (
        <>
            <header className="flex items-center w-full px-[67px] py-[25px] sticky top-0 z-50 bg-white/70 backdrop-blur-xs">
                <a className="flex items-center gap-4 flex-shrink-0" href="/">
                    <img src="/img/header/pizza-logo.png" alt="Pizza Logo" className="w-25 h-25" />
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black uppercase">next pizza</h1>
                        <p className="text-[16px] text-[#7B7B7B] leading-none">вкусней уже некуда</p>
                    </div>
                </a>

                <div className="flex-1 flex justify-center px-6">
                    <div className="flex items-center w-full max-w-[760px] h-[50px] ">
                        <SearchInput />
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                    <Button className="text-[#FE5F00] w-[110px] h-[50px] rounded-[15px] text-[16px] font-semibold" variant="outline">
                        <User strokeWidth={3} /> Войти
                    </Button>
                    <Button variant="outline" className="w-[50px] h-[50px] rounded-[15px] text-[#FE5F00]" onClick={openCart}>
                        <ShoppingCart strokeWidth={3} />
                    </Button>
                </div>
            </header>
            {open && <Cart onClose={closeCart} />}
            <div className="w-full bg-[#EDEDED] h-[1px]"></div>

        </>

    )
}