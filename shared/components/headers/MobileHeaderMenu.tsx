"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
    const [menuPosition, setMenuPosition] = useState({ top: 64, right: 12 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuId = "mobile-header-menu";

    useEffect(() => {
        if (!isOpen) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const updatePosition = () => {
            const rect = buttonRef.current?.getBoundingClientRect();
            if (!rect) return;

            setMenuPosition({
                top: rect.bottom + 8,
                right: Math.max(12, window.innerWidth - rect.right),
            });
        };

        const frameId = window.requestAnimationFrame(updatePosition);
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);
        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [isOpen]);

    const handleLogin = () => {
        setIsOpen(false);
        onLogin();
    };

    return (
        <div className="relative sm:hidden">
            <Button
                ref={buttonRef}
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

            {isOpen &&
                createPortal(
                    <>
                    <button
                        type="button"
                        aria-label="Закрыть меню"
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-[60] cursor-default bg-black/45 backdrop-blur-[2px]"
                    />
                    <nav
                        id={menuId}
                        aria-label="Основное меню"
                        style={menuPosition}
                        className="fixed z-[70] w-[min(290px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-[#F1E7DF] bg-white p-2 shadow-[0_20px_60px_rgba(40,25,15,0.24)] dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                    >
                        <div className="flex items-center justify-between px-3 pb-2 pt-1">
                            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9A8F86] dark:text-zinc-500">
                                Навигация
                            </span>
                        </div>

                        <div className="space-y-1">
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="group flex min-h-14 items-center gap-3 rounded-xl px-2 text-[15px] font-bold text-[#292929] transition-colors hover:bg-[#FFF4EC] hover:text-[#FE5F00] dark:text-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E7] text-[#FE5F00] transition-colors group-hover:bg-white dark:bg-[#4A2C1D] dark:group-hover:bg-zinc-700">
                                    <Home size={19} />
                                </span>
                                Каталог товаров
                            </Link>
                            {isAuthenticated ? (
                                <Link
                                    href="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="group flex min-h-14 items-center gap-3 rounded-xl px-2 text-[15px] font-bold text-[#292929] transition-colors hover:bg-[#FFF4EC] hover:text-[#FE5F00] dark:text-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E7] text-[#FE5F00] transition-colors group-hover:bg-white dark:bg-[#4A2C1D] dark:group-hover:bg-zinc-700">
                                        <UserRound size={19} />
                                    </span>
                                    Личный кабинет
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleLogin}
                                    className="group flex min-h-14 w-full items-center gap-3 rounded-xl px-2 text-left text-[15px] font-bold text-[#292929] transition-colors hover:bg-[#FFF4EC] hover:text-[#FE5F00] dark:text-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E7] text-[#FE5F00] transition-colors group-hover:bg-white dark:bg-[#4A2C1D] dark:group-hover:bg-zinc-700">
                                        <UserRound size={19} />
                                    </span>
                                    Войти или создать аккаунт
                                </button>
                            )}
                        </div>
                    </nav>
                    </>,
                    document.body,
                )
            }
        </div>
    );
}
