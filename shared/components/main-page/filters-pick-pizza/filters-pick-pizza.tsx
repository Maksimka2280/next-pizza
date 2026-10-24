'use client'
import { ArrowDownUp } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Api } from "../../../service/api-clients";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
export default function PizzaPick() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const categoryQuery = searchParams.get("category") ?? "";
    const selected = categoryQuery || "Все";
    const [categories, setCategories] = useState<string[]>(["Все"]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await Api.categories.getAll();
                if (Array.isArray(data)) {
                    setCategories(["Все", ...data]);
                }
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        };

        fetchCategories();
    }, []);
    const onCategoryClick = (item: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (item === "Все") {
            params.delete("category");
        } else {
            params.set("category", item);
        }

        const query = params.toString();
        const url = query ? `${pathname}?${query}` : pathname;
        router.push(url);
    };
    const sortBy = searchParams.get("sortBy") ?? "популярность";
    const onSortChange = (value: string | null) => {
        if (!value) return;

        const params = new URLSearchParams(searchParams.toString());

        if (value === "популярность") {
            params.delete("sortBy");
        } else {
            params.set("sortBy", value);
        }

        const query = params.toString();

        router.push(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
        });
    };
    return (
        <div className="flex items-center justify-between">
            <div className="w-full max-w-[700px] h-[55px] rounded-[15px] bg-[#FAFAFA] flex items-center justify-center">
                <ul className="flex w-full items-center justify-between px-[25px]">
                    {categories.map((item) => (
                        <li
                            key={item}
                            onClick={() => onCategoryClick(item)}
                            className={`flex items-center justify-center cursor-pointer text-[15px] font-[600] transition-all duration-300
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
            <div className="w-[300px] h-[55px] rounded-[15px] bg-[#FAFAFA] flex justify-center items-center gap-[10px] transition-[width] duration-300 ease-in-out">
                <p className="flex items-center text-[16px] gap-[10px]">
                    <ArrowDownUp size={15} />
                    Сортировка:
                </p>

                <Select value={sortBy} onValueChange={onSortChange} >
                    <SelectTrigger className="w-auto gap-2 border-0  bg-transparent p-0 text-[16px] text-[#FE5F00] shadow-none focus:ring-0 focus:ring-offset-0 [&>svg]:h-4 [&>svg]:w-4">
                        <SelectValue placeholder="Сортировка" />
                    </SelectTrigger>

                    <SelectContent
                        side="bottom"
                        align="end"
                        sideOffset={100}
                        className="min-w-[150px] rounded-[10px]  left-[20px]  bg-[#FAFAFA] p-2 shadow-[0px_4px_20px_0px_#00000012]"
                    >
                        <SelectItem
                            value="дешевле"
                            className="cursor-pointer rounded-[10px] px-3 py-2.5 text-[14px]  focus:bg-[#FFF3EB] focus:text-[#FE5F00] [&_svg]:text-[#FE5F00]"
                        >
                            дешевле
                        </SelectItem>

                        <SelectItem
                            value="дороже"
                            className="cursor-pointer rounded-[10px] px-3 py-2.5 text-[14px] focus:bg-[#FFF3EB] focus:text-[#FE5F00] [&_svg]:text-[#FE5F00]"
                        >
                            дороже
                        </SelectItem>
                        <SelectItem
                            value="популярность"
                            className="cursor-pointer rounded-[10px] px-3 py-2.5 text-[14px] focus:bg-[#FFF3EB] focus:text-[#FE5F00] [&_svg]:text-[#FE5F00]"
                        >
                            популярность
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

    );
}
