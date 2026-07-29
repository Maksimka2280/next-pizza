"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CardIngredientProps {
    img: string;
    name: string;
    price: number;
}

export default function CardIngredient({
    img,
    name,
    price,
}: CardIngredientProps) {
    const [active, setActive] = useState(false);

    return (
        <div
            onClick={() => setActive(!active)}
            className={cn(
                "flex w-[160px] cursor-pointer flex-col items-center rounded-[15px] border-2 p-3 transition",
                active
                    ? "border-[#FF6900]"
                    : "border-transparent"
            )}
        >
            <img
                src={img}
                alt={name}
                className="h-[120px] w-[120px] object-contain"
            />

            <h3 className="mt-3 text-center text-[18px] leading-6">
                {name}
            </h3>

            <p className="mt-2 text-[24px] font-bold">
                {price} ₽
            </p>
        </div>
    );
}