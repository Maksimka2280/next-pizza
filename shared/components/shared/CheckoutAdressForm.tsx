"use client";

import { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { Title } from "./Title";
import { CheckoutField } from "../CheckOutComponents/CheckoutField";
import { ChevronDown, Timer } from "lucide-react";

export const CheckoutAddressForm = () => {
    const methods = useFormContext();

    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showTimeOptions, setShowTimeOptions] = useState(false);
    const addressRef = useRef<HTMLUListElement | null>(null);
    const addressContainerRef = useRef<HTMLDivElement | null>(null);
    const timeRef = useRef<HTMLDivElement | null>(null);

    const suggestions = [
        "Москва, ул. Мира 12",
        "Москва, ул. Мира 12A",
        "Москва, ул. Мира 10",
    ];

    const timeOptions = [
        "Доставка в 10:30",
        "Доставка в 11:00",
        "Доставка в 12:00",
        "Доставка в 13:00",
    ];

    const addressValue = methods.watch("address") || "";

    useEffect(() => {
        setQuery(addressValue);
    }, [addressValue]);

    const filteredSuggestions = suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()));

    useEffect(() => {
        const handleDocClick = (e: MouseEvent) => {
            const target = e.target as Node;
            if (showSuggestions && addressContainerRef.current && !addressContainerRef.current.contains(target)) {
                setShowSuggestions(false);
            }

            if (showTimeOptions && timeRef.current && !timeRef.current.contains(target)) {
                setShowTimeOptions(false);
            }
        };

        document.addEventListener("mousedown", handleDocClick);
        return () => document.removeEventListener("mousedown", handleDocClick);
    }, [showSuggestions, showTimeOptions]);

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
                                    methods.clearErrors("address");
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
                    <div ref={timeRef} className="relative mt-[8px]">
                        <button type="button" onClick={() => setShowTimeOptions((s) => !s)} className="flex items-center justify-between w-60 h-[48px] rounded-[10px] px-[18px] text-[16px] bg-transparent border-0">
                            <span className="flex items-center gap-2">
                                <Timer size={20} />
                                <span>{methods.getValues("deliveryTime") || "Доставка в 11:00"}</span>
                                <ChevronDown size={20} />
                            </span>
                        </button>
                        {methods.formState.errors.deliveryTime && (
                            <span id="deliveryTime-error" className="text-[14px] font-medium text-[#FF4D4F] mt-[8px] block">
                                {String(methods.formState.errors.deliveryTime.message)}
                            </span>
                        )}
                        <ul
                            className={`w-[200px] absolute left-4 right-0 top-[66px] z-20 rounded-[10px] border bg-white shadow-lg transform origin-top transition-transform transition-opacity duration-300 ease-in-out ${showTimeOptions ? "scale-y-100 opacity-100 translate-y-0" : "scale-y-0 opacity-0 -translate-y-1 pointer-events-none"
                                }`}
                        >
                            {timeOptions.map((t) => (
                                <li
                                    key={t}
                                    onMouseDown={(ev) => {
                                        ev.preventDefault();
                                        methods.setValue("deliveryTime", t);
                                        methods.clearErrors("deliveryTime");
                                        setShowTimeOptions(false);
                                    }}
                                    className="px-[16px] py-[12px] hover:text-[#FE5F1E] hover:bg-[#FFFAF6] cursor-pointer"
                                >
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <Toaster position="top-right" />
        </div>
    );
};

