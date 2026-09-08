'use client';

import { usePizzaOptions } from "../../hooks/usePizzaOptions";
import { Ingredient, ProductItem } from '@prisma/client';
import RecommendationProducts from "../Products/cart-products-recomend";
import Link from "next/link";
import { PizzaSize, PizzaType } from "../../constants/Pizza";
import { GroupVariants } from "../GroupVariants";
import { Title } from "./Title";
import { getPizzaDetails } from "../../lib/getPizzaDetails";
import { IngredientItem } from "./IngredientItem";
import { Button } from "../ui/button";
import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { toast, Toaster } from "react-hot-toast";
import { Toast } from "@base-ui/react";
import { LoaderCircle } from "lucide-react";




interface Props {
  imageUrl: string;
  name: string;
  categoryName?: string;
  ingredients: Ingredient[];
  items: ProductItem[];
  pizzaTypes: any[];
  recommendations?: any[];
  loading?: boolean;
  className?: string;
  onSubmit?: (itemId: number, ingredients: number[]) => void;
  price: number;
}

export const ProductForm: React.FC<Props> = ({
  name,
  items,
  imageUrl,
  ingredients,
  categoryName,
  pizzaTypes,
  recommendations = [],
  className,
  onSubmit,
  loading,
  price
}) => {

  const {
    size,
    type,
    selectedIngredients,
    availableSizes,
    currentItemId,
    setSize,
    setType,
    addIngredient,
    availablePizzaSizes,
  } = usePizzaOptions(items);

  const { totalPrice, textDetaills } = getPizzaDetails(
    type,
    size,
    items,
    ingredients,
    selectedIngredients,
  );
  const { addOrIncrement } = useCart();
  const [adding, setAdding] = useState(false);

  const handleClickAdd = async () => {
    const itemIdToAdd = currentItemId ?? items?.[0]?.id ?? null;
    if (!itemIdToAdd) return;
    onSubmit?.(itemIdToAdd, Array.from(selectedIngredients));
    setAdding(true);
    try {
      await toast.promise(
        addOrIncrement({
          productItemId: itemIdToAdd,
          quantity: 1,
          ingredients: Array.from(selectedIngredients),
        }),
        {
          loading: "Добавление...",
          success: "Заказ успешно добавлен в корзину",
          error: "Не удалось добавить товар в корзину",
        }
      );
    } catch (e) {
      console.error("addOrIncrement failed", e);
    } finally {
      setAdding(false);
    }
  };
  const finalPrice = price + totalPrice;
  return (
    <div className={className}>

      <div className="flex flex-wrap items-center gap-2 text-sm text-[#777777] mb-[20px]">
        <Link href="/" className="hover:text-[#FE5F00]">
          Главная
        </Link>

        <span>/</span>

        <button className="font-semibold hover:text-[#FE5F00]">
          {categoryName || "Категория"}
        </button>

        <span>/</span>

        <span className="font-bold text-[#1F1F1F]">
          {name}
        </span>
      </div>


      <div className="grid grid-cols-2 gap-10">
        <div className="w-full aspect-square rounded-[20px] p-[40px] bg-[#FFF7EE] flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 rounded-[20px]"
          />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <Title text={name} size="md" className="font-extrabold mb-1" />

            <p className="text-[#777777] mt-2">
              {textDetaills}
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-5">
            {availableSizes?.length > 0 && (
              <GroupVariants
                items={availablePizzaSizes}
                value={String(size)}
                onClick={(value) => setSize(Number(value) as PizzaSize)}
              />
            )}

            <GroupVariants
              items={pizzaTypes}
              value={String(type)}
              onClick={(value) => setType(Number(value) as PizzaType)}
            />
          </div>

          <h2 className="text-[18px] font-bold">
            Ингредиенты
          </h2>


          <div className="flex gap-10">
            {ingredients.map((ingredient) => (
              <IngredientItem
                key={ingredient.id}
                name={ingredient.name}
                price={ingredient.price}
                imageUrl={ingredient.imageUrl}
                onClick={() => addIngredient(ingredient.id)}
                active={selectedIngredients.has(ingredient.id)}
              />
            ))}
          </div>
          <Button
            disabled={loading || adding}
            onClick={handleClickAdd}
            className="h-13.75 px-10 text-base rounded-[18px] w-full mt-8
             disabled:bg-gray-300 disabled:text-gray-500
             disabled:cursor-not-allowed"
          >
            {loading || adding ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              `Добавить в корзину за ${finalPrice} ₴`
            )}
          </Button>
        </div>

      </div>


      {recommendations.length > 0 && (
        <div className="mt-20 pb-20">
          <h2 className="mb-8 text-[28px] font-bold">
            Рекомендации
          </h2>

          <RecommendationProducts products={recommendations} />
        </div>
      )}
      <Toaster />
    </div>
  );
};