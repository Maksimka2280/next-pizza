"use client";

import { useState } from "react";
import { cn } from "../../lib/utils";

interface CardIngredientProps {
    img: string;
    name: string;
    price: number;
    loading?: boolean;
    titlesize?: "sm" | "md" | "lg";
    pricesize?: "sm" | "md" | "lg";
}

export default function CardIngredient({
    img,
    name,
    price,
    loading = false,
    titlesize = "md",
    pricesize = "md"
}: CardIngredientProps) {
    const [active, setActive] = useState(false);

    if (loading) {
        return (
            <div className="flex w-[160px] flex-col items-center rounded-[15px] border-2 border-transparent p-3 animate-pulse">
                <div className="h-[120px] w-[120px] rounded-[15px] bg-[#F4ECE4]" />

                <div className="mt-3 h-[24px] w-[80%] rounded-[8px] bg-[#F4ECE4]" />

                <div className="mt-2 h-[32px] w-[50%] rounded-[8px] bg-[#F4ECE4]" />
            </div>
        );
    }

    return (
        <>
            <div
                onClick={() => setActive(!active)}
                className={cn(
                    "flex w-[160px] cursor-pointer flex-col items-center rounded-[15px] border-2 p-3 transition",
                    active ? "border-[#FF6900]" : "border-transparent"
                )}
            >
                <img
                    src={img}
                    alt={name}
                    className="h-[120px] w-[120px] object-contain"
                />

                <h1 className={cn("mt-3 text-center", titlesize === "sm" ? "text-[14px]" : titlesize === "md" ? "text-[16px]" : "text-[18px]")}>
                    {name}
                </h1>

                <p className={cn("mt-2", pricesize === "sm" ? "text-[20px]" : pricesize === "md" ? "text-[24px]" : "text-[28px]")}>
                    {price} ₴
                </p>
            </div>
          
        </>

    );
}