'use client';

import React, { useState } from 'react';
import { Ingredient, ProductItem } from '@prisma/client';

import { PizzaImage } from './PizzaImage';
import { Title } from './Title';
import { Button } from '../ui/button';
import { GroupVariants } from '../GroupVariants';
import { PizzaSize, PizzaType, pizzaTypes } from '../../constants/Pizza';
import { IngredientItem } from './IngredientItem';
import { cn } from '../../lib/utils';
import { getPizzaDetails } from '../../lib/getPizzaDetails';
import { usePizzaOptions } from '../../hooks/usePizzaOptions';
import { useCart } from '../../hooks/useCart';

interface Props {
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
    onClickAddCart?.();
    setAdding(true);
    try {
      await addOrIncrement({ productItemId: itemIdToAdd, quantity: 1, ingredients: Array.from(selectedIngredients) });
    } catch (e) {
      console.error('addOrIncrement failed', e);
    } finally {
      setAdding(false);
    }
  };
  const finalPrice = price + totalPrice;
  return (
    <div className={cn(className, 'flex flex-1')}>
      <div className="w-1/2 flex items-center justify-center bg-white ">
        <PizzaImage imageUrl={imageUrl} size={size} className="w-full h-full" />
      </div>

      <div className="w-1/2 bg-[#F4F1EE] p-7">
        <Title text={name} size="md" className="font-extrabold mb-1" />
        <p className="text-gray-400">{textDetaills}</p>
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

        <div className="p-5 rounded-md max-h-[250px] overflow-y-auto scrollbar mt-5">
          <div className="grid grid-cols-3 gap-3">
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
        </div>

            <Button
              disabled={loading || adding}
              onClick={handleClickAdd}
              className="h-13.75 px-10 text-base rounded-[18px] w-full mt-8"
            >
              {loading || adding ? 'Добавление...' : `Добавить в корзину за ${finalPrice} ₽`}
            </Button>
      </div>
    </div>
  );
};