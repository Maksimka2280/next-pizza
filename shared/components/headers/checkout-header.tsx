'use client'
import { Input } from "@base-ui/react/input";
import { Button } from "../ui/button";
import { ShoppingCart, User } from "lucide-react";
import { SearchInput } from "../SearchInput";
import { Cart } from "../shared/Cart";
import { useState } from "react";

export default function CheckOutHeader() {

  
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
                        <Button className="text-[#FE5F00] w-[110px] h-[50px] rounded-[15px] text-[16px] font-semibold" variant="outline">
                            <User strokeWidth={3} /> Войти
                        </Button>
                    </div>
                </div>
            </header>
            <div className="w-full  bg-[#EDEDED] h-[2px]"></div>

        </>

    )
}