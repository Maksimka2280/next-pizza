'use client'
import { ArrowDownUp } from "lucide-react";
import { useState } from "react";

export default function PizzaPick() {
    const [selected, setSelected] = useState("Все");

    const items = [
        "Все",
        "Мясные",
        "Острые",
        "Сладкие",
        "Вегетарианские",
        "С курицей",
        "Ещё",
    ];

    return (
        <div className="flex items-center justify-between">
            <div className="w-full max-w-[775px] h-[55px] rounded-[15px] bg-[#FAFAFA] flex items-center justify-center">
                <ul className="flex w-full items-center justify-between px-[25px]">
                    {items.map((item) => (
                        <li
                            key={item}
                            onClick={() => setSelected(item)}
                            className={`flex items-center justify-center cursor-pointer text-[16px] font-[500] transition-all duration-300
              ${selected === item
                                    ? "text-[#FE5F00] bg-[#FFFFFF] px-[25px] h-[43px] rounded-[15px] shadow-[0px_4px_4px_0px_#0000000D]"
                                    : "text-black"
                                }
            `}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-[240px] h-[55px] rounded-[15px] bg-[#FAFAFA] flex justify-center items-center gap-[10px]">
                <p className="flex items-center text-[16px] gap-[10px]"><span><ArrowDownUp size={15} /></span>Сортировка:</p>
                <button className="text-[16px] text-[#FE5F00]">рейтингу</button>
            </div>
        </div>

    );
}
