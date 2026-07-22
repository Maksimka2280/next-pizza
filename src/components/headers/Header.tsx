import { Input } from "@base-ui/react/input";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { SearchInput } from "../SearchInput";

export default function Header() {
    
    return (
        <>
            <header className="flex items-center w-full px-[67px] py-[45px] sticky top-0 z-50 bg-white/70 backdrop-blur-xs">
                <div className="flex items-center gap-4 flex-shrink-0">
                    <img src="/img/header/pizza-logo.png" alt="Pizza Logo" className="w-13 h-13" />
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black uppercase">next pizza</h1>
                        <p className="text-[16px] text-[#7B7B7B] leading-none">вкусней уже некуда</p>
                    </div>
                </div>

                <div className="flex-1 flex justify-center px-6">
                    <div className="flex items-center w-full max-w-[760px] h-[50px] ">
                        <SearchInput />
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                    <Button className="text-[#FE5F00] w-[110px] h-[50px] rounded-[15px] text-[16px] font-semibold" variant="outline">
                        <img src="/img/header/icon-login-header.svg" alt="Войти" /> Войти
                    </Button>
                    <Button variant="outline" className="w-[50px] h-[50px] rounded-[15px]">
                        <ShoppingCart size={16} color="#FE5F00" />
                    </Button>
                </div>
            </header>

            <div className="w-full bg-[#EDEDED] h-[1px]"></div>
        </>

    )
}