'use client'
import { Checkbox } from "@/components/ui/checkbox";
import CustomInput from "@/components/ui/CustomInput";
import { Input } from "@base-ui/react/input";
import { useState } from "react";


export default function MainFilters() {
    const [minPrice, setMinPrice] = useState<number | "">("")
    const [maxPrice, setMaxPrice] = useState<number | "">("")
    return (
        <>
            <div className="w-[250px]">
                <h1 className="text-[22px] font-[700]">Фильтрация</h1>
                <div className="flex flex-col gap-2 mt-[25px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox /> <span>Можно собирать</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox /> <span>Новинки</span>
                    </label>
                </div>
                 <div className="w-full bg-[#EDEDED] h-[1px] my-[25px]"></div>
                <h2 className="text-[16px] font-[700]">Цена от и до:</h2>
                <div className="flex gap-[15px] pt-[15px]">
                    <CustomInput
                        type="number"
                        value={minPrice}
                        onChange={(v) => setMinPrice(v === "" ? "" : Number(v))}
                        placeholder="0"
                        width="90px"
                    />
                    <CustomInput
                        type="number"
                        value={maxPrice}
                        onChange={(v) => setMaxPrice(v === "" ? "" : Number(v))}
                        placeholder="0"
                        width="90px"
                    />
                </div>
            </div>
        </>
    )
}