import type { Ingredient, ProductItem } from '@prisma/client';
import { Mapsize, Maptype, type PizzaSize, type PizzaType } from '../constants/Pizza';

export interface PizzaDetailsResult {
  totalPrice: number;
  textDetaills: string;
}

export const getPizzaDetails = (
  type: PizzaType,
  size: PizzaSize,
  items: ProductItem[],
  ingredients: Ingredient[],
  selectedIngredients: Set<number>,
): PizzaDetailsResult => {
  const currentItem = items.find(
    (item) => item.size === size && item.pizzaType === type,
  );

  const ingredientsTotal = ingredients
    .filter((ingredient) => selectedIngredients.has(ingredient.id))
    .reduce((acc, ingredient) => acc + ingredient.price, 0);

  const basePrice = currentItem?.price ?? 0;
  const totalPrice = basePrice + ingredientsTotal;

  const sizeLabel = Mapsize[size] ?? `${size} см`;
  const typeLabel = Maptype[type] ?? 'Традиционное';
  const ingredientCount = selectedIngredients.size;

  const ingredientText = ingredientCount
    ? `${ingredientCount} ${ingredientCount === 1 ? 'ингредиент' : 'ингредиента'}`
    : 'без добавок';

  return {
    totalPrice,
    textDetaills: `${sizeLabel}, ${typeLabel} — ${ingredientText}`,
  };
};
