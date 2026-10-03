"use client";

import { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { Title } from "./Title";
import { CheckoutField } from "../CheckOutComponents/CheckoutField";
import { Timer } from "lucide-react";

export const CheckoutAddressForm = () => {
    const methods = useFormContext();

    const formatTimeValue = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);

        if (digits.length <= 2) return digits;
        return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
    };

    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const addressRef = useRef<HTMLUListElement | null>(null);
    const addressContainerRef = useRef<HTMLDivElement | null>(null);

    const filteredSuggestions = query.trim() ? [query.trim()] : [];

    useEffect(() => {
        const handleDocClick = (e: MouseEvent) => {
            const target = e.target as Node;
            if (showSuggestions && addressContainerRef.current && !addressContainerRef.current.contains(target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleDocClick);
        return () => document.removeEventListener("mousedown", handleDocClick);
    }, [showSuggestions]);

    return (
        <div className="w-full max-w-[750px] rounded-[30px] bg-white px-[30px] py-[30px]">
            <Title text="3. Адрес доставки" className="mb-[24px] font-bold" size="md" />
            <div className="my-[25px] h-[1px] w-full bg-[#EDEDED]" />
            <div className="">
                <div ref={addressContainerRef} className="flex w-full flex-col gap-[8px] relative">
                    <label className="text-[14px] font-bold text-[#212121]">Введите адрес</label>
                    <input
                        {...methods.register("address")}
                        value={query}
                        placeholder="Например: Москва, ул. Мира 12"
                        aria-invalid={Boolean(methods.formState.errors.address)}
                        aria-describedby={methods.formState.errors.address ? "address-error" : undefined}
                        className={`h-[48px] w-full rounded-[10px] border bg-transparent px-[18px] text-[16px] text-[#1F1F1F] outline-none transition-all ${methods.formState.errors.address ? "border-[#FF4D4F] shadow-[0_0_0_1px_rgba(255,77,79,0.35)]" : "border-[#E7E7E7] focus:border-[#FF7A00]"
                            }`}
                        onFocus={() => setShowSuggestions(true)}
                        onClick={() => setShowSuggestions(true)}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            methods.setValue("address", e.target.value);
                        }}
                    />
                    {methods.formState.errors.address && (
                        <span id="address-error" className="text-[14px] font-medium text-[#FF4D4F] mt-[8px] block">
                            {String(methods.formState.errors.address.message)}
                        </span>
                    )}

                    <ul
                        ref={addressRef}
                        className={`absolute left-0 right-0 top-[77px] z-20 max-h-[220px] overflow-auto rounded-[10px] border bg-white shadow-lg transform origin-top transition-transform transition-opacity duration-300 ease-in-out ${showSuggestions && filteredSuggestions.length > 0 ? "scale-y-100 opacity-100 translate-y-0" : "scale-y-0 opacity-0 -translate-y-1 pointer-events-none"
                            }`}
                    >
                        {filteredSuggestions.map((s) => (
                            <li
                                key={s}
                                onMouseDown={(ev) => {
                                    ev.preventDefault();
                                    methods.setValue("address", s);
                                    setQuery(s);
                                    setShowSuggestions(false);
                                }}
                                className="px-[16px] py-[12px] hover:text-[#FE5F1E] hover:bg-[#FFFAF6] cursor-pointer"
                            >
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-[16px]">
                    <CheckoutField name="comment" label="Комментарий к заказу" placeholder="Укажите тут дополнительную информацию для курьера" autoComplete="" textarea />
                </div>
                <div className="mt-[20px]">
                    <label className="text-[14px] font-bold text-[#212121]">Время доставки</label>
                    <div className="relative mt-[8px]">
                        <div className="flex items-center gap-[10px] h-[48px] w-full rounded-[10px] border border-[#E7E7E7] bg-transparent px-[18px] transition-all focus-within:border-[#FF7A00]">
                            <Timer size={20} className="text-[#212121]" />
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={5}
                                placeholder="Например: 18:30"
                                className="h-full w-full border-0 bg-transparent text-[16px] text-[#1F1F1F] outline-none placeholder:text-[#A7A7A7]"
                                {...methods.register("deliveryTime", {
                                    setValueAs: (value: string) => formatTimeValue(value),
                                    onChange: (event) => {
                                        const nextValue = formatTimeValue(event.target.value);
                                        event.target.value = nextValue;
                                    },
                                })}
                            />
                        </div>
                        {methods.formState.errors.deliveryTime && (
                            <span id="deliveryTime-error" className="text-[14px] font-medium text-[#FF4D4F] mt-[8px] block">
                                {String(methods.formState.errors.deliveryTime.message)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <Toaster position="top-center" />
        </div>
    );
};

