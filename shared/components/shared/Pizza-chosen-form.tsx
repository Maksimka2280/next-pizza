'use client';

import React, { useState } from 'react';
import { Ingredient, ProductItem } from '@prisma/client';
import toast, { Toaster } from 'react-hot-toast';
import { PizzaImage } from './PizzaImage';
import { Title } from './Title';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { getPizzaDetails } from '../../lib/getPizzaDetails';
import { usePizzaOptions } from '../../hooks/usePizzaOptions';
import { useCart } from '../../hooks/useCart';
import { LoaderCircle } from 'lucide-react';
import { FavoriteButton } from '../Products/FavoriteButton';
import { IngredientGrid } from './IngredientGrid';
import { PizzaVariantSelectors } from './PizzaVariantSelectors';

interface Props {
  productId: number;
  isFavorite: boolean;
  imageUrl: string;
  name: string;
  ingredients: Ingredient[];
  items: ProductItem[];
  loading?: boolean;
  className?: string;
  price: number;
  onClickAddCart?: VoidFunction;
}



export const ChoosePizzaForm: React.FC<Props> = ({
  productId,
  isFavorite,
  name,
  items,
  imageUrl,
  ingredients,
  loading,
  className,
  price,
  onClickAddCart
}) => {
  const {
    size,
    type,
    selectedIngredients,
    availableSizes,
    availablePizzaSizes,
    setSize,
    setType,
    addIngredient,
    currentItemId,
  } = usePizzaOptions(items)
  const { addOrIncrement } = useCart();
  const [adding, setAdding] = useState(false);
  const { totalPrice, textDetaills } = getPizzaDetails(
    type,
    size,
    items,
    ingredients,
    selectedIngredients,
  );

  const handleClickAdd = async () => {
    const itemIdToAdd = currentItemId ?? items?.[0]?.id ?? null;
    if (!itemIdToAdd) return;
    onClickAddCart?.();
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
    <div className={cn(className, 'flex min-w-0 flex-1 flex-col md:flex-row')}>
      <div className="relative flex min-h-[220px] w-full items-center justify-center overflow-hidden bg-white sm:min-h-[280px] md:min-h-0 md:w-1/2">
        <PizzaImage imageUrl={imageUrl} size={size} className="h-full w-full" />
      </div>

      <div className="w-full min-w-0 bg-[#F4F1EE] p-4 sm:p-6 md:w-1/2 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <Title text={name} size="md" className="font-extrabold mb-1" />
          <FavoriteButton productId={productId} initialFavorite={isFavorite} />
        </div>
        <p className="text-gray-400">{textDetaills}</p>
        <PizzaVariantSelectors
          availableSizes={availableSizes}
          availablePizzaSizes={availablePizzaSizes}
          size={size}
          type={type}
          onSizeChange={setSize}
          onTypeChange={setType}
        />

        <IngredientGrid
          ingredients={ingredients}
          selectedIngredients={selectedIngredients}
          onToggle={addIngredient}
          itemClassName="w-full"
          className="mt-5 grid max-h-[250px] min-w-0 grid-cols-[repeat(2,minmax(0,1fr))] gap-2 overflow-y-auto rounded-md p-2 sm:grid-cols-[repeat(3,minmax(0,1fr))] sm:gap-3"
        />

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

        <Toaster position="top-center" />
      </div>
    </div>
  );
};