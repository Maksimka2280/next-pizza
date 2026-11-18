"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowRight, Home, Menu, UserRound, X } from "lucide-react";
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
    const [menuPosition, setMenuPosition] = useState({ top: 64, left: "50%" });
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
                left: "50%",
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
                        className="fixed z-[70] w-[min(340px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-[24px] border border-[#F1E7DF] bg-white p-3 shadow-[0_24px_70px_rgba(40,25,15,0.24)] dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
                    >
                        <div className="flex items-start justify-between gap-3 px-2 pb-3 pt-1">
                            <div>
                                <p className="text-lg font-extrabold text-[#242424] dark:text-zinc-100">
                                    Куда направимся?
                                </p>
                                <p className="mt-0.5 text-sm text-[#8A786C] dark:text-zinc-400">
                                    Быстрый доступ к разделам
                                </p>
                            </div>
                            <button
                                type="button"
                                aria-label="Закрыть меню"
                                onClick={() => setIsOpen(false)}
                                className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#8A786C] transition hover:bg-[#FFF4EC] hover:text-[#FE5F00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FE5F00] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-orange-300"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="group flex min-h-[68px] items-center gap-3 rounded-2xl border border-transparent px-2.5 text-[15px] font-bold text-[#292929] transition-colors hover:border-[#F6E4D8] hover:bg-[#FFF8F3] hover:text-[#FE5F00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FE5F00] dark:text-zinc-100 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-orange-300"
                            >
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0E7] text-[#FE5F00] transition-colors group-hover:bg-white dark:bg-[#4A2C1D] dark:group-hover:bg-zinc-700">
                                    <Home size={20} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block">Каталог товаров</span>
                                    <span className="mt-0.5 block text-xs font-medium text-[#8A786C] dark:text-zinc-400">
                                        Пицца, закуски и напитки
                                    </span>
                                </span>
                                <ArrowRight className="size-4 shrink-0 text-[#B6A79D] transition-transform group-hover:translate-x-0.5 group-hover:text-[#FE5F00] dark:text-zinc-500" />
                            </Link>
                            {isAuthenticated ? (
                                <Link
                                    href="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="group flex min-h-[68px] items-center gap-3 rounded-2xl border border-transparent px-2.5 text-[15px] font-bold text-[#292929] transition-colors hover:border-[#F6E4D8] hover:bg-[#FFF8F3] hover:text-[#FE5F00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FE5F00] dark:text-zinc-100 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-orange-300"
                                >
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0E7] text-[#FE5F00] transition-colors group-hover:bg-white dark:bg-[#4A2C1D] dark:group-hover:bg-zinc-700">
                                        <UserRound size={20} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block">Личный кабинет</span>
                                        <span className="mt-0.5 block text-xs font-medium text-[#8A786C] dark:text-zinc-400">
                                            Профиль и ваши заказы
                                        </span>
                                    </span>
                                    <ArrowRight className="size-4 shrink-0 text-[#B6A79D] transition-transform group-hover:translate-x-0.5 group-hover:text-[#FE5F00] dark:text-zinc-500" />
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleLogin}
                                    className="group flex min-h-[68px] w-full items-center gap-3 rounded-2xl border border-transparent px-2.5 text-left text-[15px] font-bold text-[#292929] transition-colors hover:border-[#F6E4D8] hover:bg-[#FFF8F3] hover:text-[#FE5F00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FE5F00] dark:text-zinc-100 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-orange-300"
                                >
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0E7] text-[#FE5F00] transition-colors group-hover:bg-white dark:bg-[#4A2C1D] dark:group-hover:bg-zinc-700">
                                        <UserRound size={20} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block">Войти или создать аккаунт</span>
                                        <span className="mt-0.5 block text-xs font-medium text-[#8A786C] dark:text-zinc-400">
                                            Авторизация и регистрация
                                        </span>
                                    </span>
                                    <ArrowRight className="size-4 shrink-0 text-[#B6A79D] transition-transform group-hover:translate-x-0.5 group-hover:text-[#FE5F00] dark:text-zinc-500" />
                                </button>
                            )}
                        </div>
                        <div className="mt-2 border-t border-[#F1E7DF] px-2 pt-3 text-center text-[11px] font-semibold tracking-wide text-[#9A8F86] dark:border-zinc-700 dark:text-zinc-500">
                            ВКУСНЕЙ УЖЕ НЕКУДА
                        </div>
                    </nav>
                    </>,
                    document.body,
                )
            }
        </div>
    );
}
