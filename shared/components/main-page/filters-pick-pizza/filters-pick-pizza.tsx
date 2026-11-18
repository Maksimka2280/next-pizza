'use client'
import { ArrowDownUp, Check } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

export default function PizzaPick({ categories }: { categories: string[] }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const categoryQuery = searchParams.get("category") ?? "";
    const selected = categoryQuery || "Все";
    const categoryOptions = ["Все", ...categories];
    const onCategoryClick = (item: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (item === "Все") {
            params.delete("category");
        } else {
            params.set("category", item);
        }

        const query = params.toString();
        const url = query ? `${pathname}?${query}` : pathname;
        router.push(url, { scroll: false });
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
        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="w-full min-w-0 rounded-2xl border border-[#F1E7DF] bg-[#FFFCFA] p-3 sm:p-4 lg:max-w-[760px]">
                <div className="mb-2 flex items-center justify-between px-1">
                    <span className="text-xs font-bold uppercase tracking-wide text-[#8A786C] sm:text-sm">Выберите категорию</span>
                </div>
                <ul aria-label="Категории товаров" className="flex flex-wrap gap-2">
                    {categoryOptions.map((item) => (
                        <li
                            key={item}
                            className="min-w-0"
                        >
                            <button
                                type="button"
                                aria-pressed={selected === item}
                                onClick={() => onCategoryClick(item)}
                                className={`flex min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FE5F00] focus-visible:ring-offset-2 sm:px-4
                                    ${selected === item
                                        ? "border-[#FE5F00] bg-[#FE5F00] text-white shadow-sm"
                                        : "border-[#E8DDD5] bg-white text-[#4B4039] hover:border-[#FE5F00] hover:bg-[#FFF3EB] hover:text-[#D94E00]"
                                    }`}
                            >
                                {selected === item && <Check size={15} strokeWidth={3} aria-hidden="true" />}
                                {item}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[15px] border border-[#F1E7DF] bg-white px-3 lg:w-[300px] lg:shrink-0">
                <p className="flex items-center gap-2 whitespace-nowrap text-sm sm:text-[16px]">
                    <ArrowDownUp size={16} aria-hidden="true" />
                    Сортировка:
                </p>

                <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger aria-label="Сортировка товаров" className="h-auto w-auto gap-1 border-0 bg-transparent p-0 text-sm font-bold text-[#FE5F00] shadow-none focus:ring-0 focus:ring-offset-0 [&>svg]:h-4 [&>svg]:w-4 sm:text-base">
                        <SelectValue placeholder="Сортировка" />
                    </SelectTrigger>

                    <SelectContent
                        side="bottom"
                        align="end"
                        sideOffset={6}
                        className="min-w-[180px] rounded-xl border border-[#F1E7DF] bg-white p-2 shadow-[0px_4px_20px_0px_#00000012]"
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
