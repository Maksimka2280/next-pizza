'use client'
import { ArrowDownUp } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
                const response = await fetch("/api/categories");
                if (!response.ok) return;
                const data = await response.json();
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
            <div className="w-[240px] h-[55px] rounded-[15px] bg-[#FAFAFA] flex justify-center items-center gap-[10px]">
                <p className="flex items-center text-[16px] gap-[10px]"><span><ArrowDownUp size={15} /></span>Сортировка:</p>
                <button className="text-[16px] text-[#FE5F00]">рейтингу</button>
            </div>
        </div>

    );
}
