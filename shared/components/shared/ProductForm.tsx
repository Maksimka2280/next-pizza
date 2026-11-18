'use client';

import { usePizzaOptions } from "../../hooks/usePizzaOptions";
import type { Ingredient, Product, ProductItem } from "@prisma/client";
import { PizzaSize, PizzaType } from "../../constants/Pizza";
import { Title } from "./Title";
import { getPizzaDetails } from "../../lib/getPizzaDetails";
import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { toast, Toaster } from "react-hot-toast";
import { FavoriteButton } from "../Products/FavoriteButton";
import { ProductCustomization } from "./ProductCustomization";
import { ProductBreadcrumbs } from "./ProductBreadcrumbs";
import { ProductRecommendations } from "./ProductRecommendations";

interface Props {
  imageUrl: string;
  name: string;
  categoryName?: string;
  ingredients: Ingredient[];
  items: ProductItem[];
  recommendations?: Array<Product & { ingredients: Ingredient[]; items: ProductItem[] }>;
  loading?: boolean;
  onSubmit?: (itemId: number, ingredients: number[]) => void;
  price: number;
  productId: number;
  isFavorite: boolean;
  favoriteIds: number[];
}

export const ProductForm: React.FC<Props> = ({
  name,
  items,
  imageUrl,
  ingredients,
  categoryName,
  recommendations = [],
  onSubmit,
  loading,
  price,
  productId,
  isFavorite,
  favoriteIds,
}) => {

  const {
    size,
    type,
    selectedIngredients,
    currentItemId,
    setSize,
    setType,
    addIngredient,
    availablePizzaSizes,
    availableTypeOptions,
    hasTypeSelector,
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
          loading: "Добавляем...",
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
    <div className='mx-auto w-full max-w-[1300px] px-3 sm:px-5 lg:px-0'>
      <ProductBreadcrumbs categoryName={categoryName} productName={name} />
      <div className="grid w-full max-w-[1300px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[20px] bg-[#FFF7EE] p-5 sm:p-8 lg:p-[40px]">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 rounded-[20px]"
          />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex min-w-0 items-start justify-between gap-3">
              <Title text={name} size="md" className="font-extrabold mb-1" />
              <FavoriteButton productId={productId} initialFavorite={isFavorite} />
            </div>

            <p className="text-[#777777] mt-2">
              {textDetaills}
            </p>
          </div>

          <ProductCustomization
            availablePizzaSizes={availablePizzaSizes}
            availableTypeOptions={availableTypeOptions}
            hasTypeSelector={hasTypeSelector}
            size={size}
            type={type}
            ingredients={ingredients}
            selectedIngredients={selectedIngredients}
            loading={Boolean(loading)}
            adding={adding}
            finalPrice={finalPrice}
            onSizeChange={(value) => setSize(Number(value) as PizzaSize)}
            onTypeChange={(value) => setType(Number(value) as PizzaType)}
            onIngredientToggle={addIngredient}
            onAdd={handleClickAdd}
          />
        </div>

      </div>
      <ProductRecommendations
        products={recommendations}
        favoriteIds={favoriteIds}
      />
      <Toaster position="top-center" />
    </div>
  );
};