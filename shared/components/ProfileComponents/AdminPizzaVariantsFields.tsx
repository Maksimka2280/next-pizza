"use client";

import type { AdminProductVariant } from "../../api/admin-products";
import { pizzaTypes, pizzasize, type PizzaSize, type PizzaType } from "../../constants/Pizza";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type AdminPizzaVariantsFieldsProps = {
  selectedSize: PizzaSize;
  onSizeChange: (size: PizzaSize) => void;
  selectedPizzaType: PizzaType;
  onPizzaTypeChange: (type: PizzaType) => void;
  price: string;
  onPriceChange: (price: string) => void;
  variants: AdminProductVariant[];
  onAddVariant: () => void;
  onRemoveVariant: (variant: AdminProductVariant) => void;
};

export function AdminPizzaVariantsFields({
  selectedSize,
  onSizeChange,
  selectedPizzaType,
  onPizzaTypeChange,
  price,
  onPriceChange,
  variants,
  onAddVariant,
  onRemoveVariant,
}: AdminPizzaVariantsFieldsProps) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-4 rounded-xl border p-3 sm:p-4">
      <legend className="px-1 text-sm font-semibold">Варианты пиццы</legend>
      <div className="grid min-w-0 gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-semibold">
          Размер
          <Select value={String(selectedSize)} onValueChange={(value) => value && onSizeChange(Number(value) as PizzaSize)}>
            <SelectTrigger aria-label="Размер пиццы" className="h-11 w-full rounded-xl px-4 font-normal">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pizzasize.map((size) => (
                <SelectItem key={size.value} value={size.value}>{size.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          Тип теста
          <Select value={String(selectedPizzaType)} onValueChange={(value) => value && onPizzaTypeChange(Number(value) as PizzaType)}>
            <SelectTrigger aria-label="Тип теста" className="h-11 w-full rounded-xl px-4 font-normal">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pizzaTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm font-semibold">
        Цена товара для выбранного размера и теста, ₴
        <Input type="number" min="1" max="1000000" step="1" value={price} onChange={(event) => onPriceChange(event.target.value)} className="h-11 rounded-xl px-4 font-normal" />
      </label>
      <Button type="button" variant="outline" onClick={onAddVariant} className="h-10 rounded-xl">
        Добавить размер и тесто
      </Button>
      {variants.map((variant) => (
        <div key={`${variant.size}-${variant.pizzaType}`} className="flex min-w-0 flex-col gap-2 rounded-lg bg-[#FFF7EE] px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="break-words">
            {pizzasize.find((size) => Number(size.value) === variant.size)?.name},{" "}
            {pizzaTypes.find((type) => Number(type.value) === variant.pizzaType)?.name} — {variant.price} ₴
          </span>
          <Button type="button" variant="ghost" onClick={() => onRemoveVariant(variant)} className="h-8 self-start px-2 text-red-600 sm:self-auto">
            Удалить
          </Button>
        </div>
      ))}
    </fieldset>
  );
}
