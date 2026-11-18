"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Menu, UserRound, X } from "lucide-react";
import { Button } from "../ui/button";

interface MobileHeaderMenuProps {
    isAuthenticated: boolean;
    onLogin: () => void;
}

export function MobileHeaderMenu({
    isAuthenticated,
    onLogin,
}: MobileHeaderMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuId = "mobile-header-menu";

    useEffect(() => {
        if (!isOpen) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [isOpen]);

    const handleLogin = () => {
        setIsOpen(false);
        onLogin();
    };

    return (
        <div className="relative sm:hidden">
            <Button
                type="button"
                variant="outline"
                aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
                aria-expanded={isOpen}
                aria-controls={menuId}
                onClick={() => setIsOpen((open) => !open)}
                className="size-10 rounded-xl border-[#F0D8C8] p-0 text-[#FE5F00]"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            {isOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Закрыть меню"
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-40 cursor-default bg-black/20"
                    />
                    <nav
                        id={menuId}
                        aria-label="Основное меню"
                        className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(290px,calc(100vw-24px))] rounded-2xl border border-[#F1E7DF] bg-white p-3 shadow-[0_16px_40px_rgba(40,25,15,0.18)]"
                    >
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="flex min-h-12 items-center gap-3 rounded-xl px-3 font-semibold text-[#242424] transition hover:bg-[#FFF4EC] hover:text-[#FE5F00]"
                        >
                            <Home size={18} />
                            Каталог товаров
                        </Link>
                        {isAuthenticated ? (
                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex min-h-12 items-center gap-3 rounded-xl px-3 font-semibold text-[#242424] transition hover:bg-[#FFF4EC] hover:text-[#FE5F00]"
                            >
                                <UserRound size={18} />
                                Личный кабинет
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={handleLogin}
                                className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left font-semibold text-[#242424] transition hover:bg-[#FFF4EC] hover:text-[#FE5F00]"
                            >
                                <UserRound size={18} />
                                Войти или создать аккаунт
                            </button>
                        )}
                    </nav>
                </>
            )}
        </div>
    );
}
