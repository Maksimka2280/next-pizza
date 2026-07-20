'use client'
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomInput from "@/components/ui/CustomInput";
import { Radio } from "@/components/ui/Radio";
import { Input } from "@base-ui/react/input";
import { useState } from "react";

const options = [
    "Сырный соус",
    "Моцарелла",
    "Чеснок",
    "Солённые огурчики",
    "Красный лук",
    "Томаты",
    "Базилик",
    "Перец",
    "Оливки",
];
export default function MainFilters() {
    const [value, setValue] = useState("Традиционное")
    const [minPrice, setMinPrice] = useState<number | "">("")
    const [maxPrice, setMaxPrice] = useState<number | "">("")
    const [selected, setSelected] = useState<string[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [selected2, setSelected2] = useState("Традиционное")

    const handleChange = (val: string) => setSelected2(val)

    const toggleOption = (option: string) => {
        setSelected(prev =>
            prev.includes(option)
                ? prev.filter(o => o !== option)
                : [...prev, option]
        );
    };
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
                <div className="w-full bg-[#EDEDED] h-[1px] my-[25px]"></div>
                <div className="flex flex-col gap-4 mt-[25px]">
                    <h2 className="text-[16px] font-[700]">Ингредиенты:</h2>
                    <div className="overflow-hidden transition-all duration-300 ease-in-out">
                        <div className={`flex flex-col gap-2 transition-all duration-300 ease-in-out ${showAll ? 'max-h-[500px] opacity-100' : 'max-h-[140px] opacity-100'}`}>
                            {options.slice(0, showAll ? options.length : 6).map(option => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                        checked={selected.includes(option)}
                                        onCheckedChange={() => toggleOption(option)}
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex">
                        <button
                            className="text-[#FE5F00] text-[16px] hover:underline transition-all duration-200"
                            onClick={() => setShowAll(prev => !prev)}
                        >
                            {showAll ? "- Скрыть" : "+ Показать всё"}
                        </button>
                    </div>
                    <h2 className="text-[16px] font-[700]">Тип теста:</h2>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Radio
                                value="Традиционное"
                                checked={selected2 === "Традиционное"}
                                onCheckedChange={() => handleChange("Традиционное")}
                            />
                            <span>Традиционное</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <Radio
                                value="Тонкое"
                                checked={selected2 === "Тонкое"}
                                onCheckedChange={() => handleChange("Тонкое")}
                            />
                            <span>Тонкое</span>
                        </label>
                        <Button className={'h-[50px] rounded-[18px] mt-[35px]'}>Применить</Button>
                    </div>
                </div>
            </div>
        </>
    )
}