'use client'
import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { CheckboxFiltersGroup } from "../../../components/shared/GroupeFilterCheckbox";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import CustomInput from "../../../components/ui/CustomInput";
import { Radio } from "../../../components/ui/Radio";
import type { Ingredient } from "@prisma/client";
import { useProductFilters } from "../../../hooks/use-product-filters";
import { usePathname, useRouter } from 'next/navigation'

export default function MainFilters({
  ingredients,
}: {
  ingredients: Pick<Ingredient, "id" | "name">[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    pendingMinPrice,
    setPendingMinPrice,
    pendingMaxPrice,
    setPendingMaxPrice,
    pendingIngredientIds,
    pendingCanBuild,
    setPendingCanBuild,
    pendingNew,
    setPendingNew,
    selected2,
    setSelected2,
    items,
    toggleIngredient,
    applyFilters,
  } = useProductFilters(ingredients);
  const router = useRouter()
  const pathname = usePathname()

  function resetFilters() {
    setPendingMinPrice("")
    setPendingMaxPrice("")
    // setPendingIngredientIds(new Set())
    setPendingCanBuild(false)
    setPendingNew(false)
    setSelected2("Традиционное")
    router.push(pathname)
  }

  return (
    <div className="w-full lg:w-[250px]">
      <button
        type="button"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
        className="flex min-h-12 w-full items-center justify-between rounded-xl border border-[#F1E7DF] bg-[#FFFCFA] px-4 text-left shadow-sm transition hover:border-[#FE5F00] dark:border-zinc-700 dark:bg-[#18181b] lg:hidden"
      >
        <span className="flex items-center gap-2 font-bold">
          <SlidersHorizontal className="size-4 text-[#FE5F00]" />
          Фильтры товаров
        </span>
        <ChevronDown className={`size-4 text-[#8A786C] transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`${mobileOpen ? "block" : "hidden"} mt-4 rounded-2xl border border-[#F1E7DF] bg-[#FFFCFA] p-4 dark:border-zinc-700 dark:bg-[#18181b] lg:mt-0 lg:block lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:dark:border-0 lg:dark:bg-transparent`}>
      <h1 className="text-[22px] font-[700]">Фильтрация</h1>
      <div className="flex flex-col gap-2 mt-[25px]">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={pendingCanBuild}
            onCheckedChange={(checked) => setPendingCanBuild(Boolean(checked))}
          />
          <span>Можно собирать</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={pendingNew}
            onCheckedChange={(checked) => setPendingNew(Boolean(checked))}
          />
          <span>Новинки</span>
        </label>
      </div>
      <div className="w-full bg-[#EDEDED] h-[1px] my-[25px] dark:bg-zinc-700"></div>
      <h2 className="text-[16px] font-[700]">Цена от и до:</h2>
      <div className="flex flex-col gap-4 pt-[15px]">
        <div className="flex gap-[15px]">
          <CustomInput
            type="number"
            value={pendingMinPrice}
            onChange={(v) => setPendingMinPrice(v === "" ? "" : Number(v))}
            placeholder="0"
            width="90px"
          />
          <CustomInput
            type="number"
            value={pendingMaxPrice}
            onChange={(v) => setPendingMaxPrice(v === "" ? "" : Number(v))}
            placeholder="0"
            width="90px"
          />
        </div>
      </div>
      <div className="w-full bg-[#EDEDED] h-[1px] my-[25px] dark:bg-zinc-700"></div>
      <div className="flex flex-col gap-4 mt-[25px]">
        <CheckboxFiltersGroup
          title="Ингредиенты"
          name="ingredients"
          className="mt-5"
          limit={6}
          defaultItems={items.slice(0, 6)}
          items={items}
          loading={false}
          onClickCheckbox={toggleIngredient}
          selected={pendingIngredientIds}
        />

        <h2 className="text-[16px] font-[700]">Тип теста:</h2>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Radio
              value="Традиционное"
              checked={selected2 === "Традиционное"}
              onCheckedChange={() => setSelected2("Традиционное")}
            />
            <span>Традиционное</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <Radio
              value="Тонкое"
              checked={selected2 === "Тонкое"}
              onCheckedChange={() => setSelected2("Тонкое")}
            />
            <span>Тонкое</span>
          </label>
          <div className="flex flex-col gap-3">
            <Button onClick={applyFilters} className={'h-[50px] rounded-[18px] mt-[35px] font-bold'}>Применить</Button>
            <Button variant="outline" onClick={resetFilters} className={'h-[50px] rounded-[18px] text-[#FE5F00]  font-bold'}>Сбросить</Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
