'use client';

import React from 'react';
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

interface Props {
  imageUrl: string;
  name: string;
  ingredients: Ingredient[];
  items: ProductItem[];
  loading?: boolean;
  onSubmit?: (itemId: number, ingredients: number[]) => void;
  className?: string;
  price: number;
}



export const ChoosePizzaForm: React.FC<Props> = ({
  name,
  items,
  imageUrl,
  ingredients,
  loading,
  onSubmit,
  className,
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
  } = usePizzaOptions(items);

  const { totalPrice, textDetaills } = getPizzaDetails(
    type,
    size,
    items,
    ingredients,
    selectedIngredients,
  );

  const handleClickAdd = () => {
    if (currentItemId) {
      onSubmit?.(currentItemId, Array.from(selectedIngredients));
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
              items={availableSizes}
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

        <div className="p-5 rounded-md h-auto overflow-auto scrollbar mt-5">
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
          disabled={loading}
          onClick={handleClickAdd}
          className="h-13.75 px-10 text-base rounded-[18px] w-full mt-10"
        >
          {loading ? 'Добавление...' : `Добавить в корзину за ${finalPrice} ₽`}
        </Button>
      </div>
    </div>
  );
};