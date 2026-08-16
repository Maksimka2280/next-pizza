'use client'
import { CheckboxFiltersGroup } from "../../../components/shared/GroupeFilterCheckbox";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import CustomInput from "../../../components/ui/CustomInput";
import { Radio } from "../../../components/ui/Radio";
import { useIngredients } from "../../../hooks/use-ingredients";
import { useProductFilters } from "../../../hooks/use-product-filters";

export default function MainFilters() {
  const { ingredients, loading } = useIngredients();
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

  return (
    <div className="w-[250px]">
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
      <div className="w-full bg-[#EDEDED] h-[1px] my-[25px]"></div>
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
      <div className="w-full bg-[#EDEDED] h-[1px] my-[25px]"></div>
      <div className="flex flex-col gap-4 mt-[25px]">
        <CheckboxFiltersGroup
          title="Ингредиенты"
          name="ingredients"
          className="mt-5"
          limit={6}
          defaultItems={items.slice(0, 6)}
          items={items}
          loading={loading}
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
          <Button onClick={applyFilters} className={'h-[50px] rounded-[18px] mt-[35px]'}>Применить</Button>
        </div>
      </div>
    </div>
  );
}
