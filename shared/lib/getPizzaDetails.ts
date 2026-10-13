import type { Ingredient, ProductItem } from '@prisma/client';
import { getVariantLabel, Maptype, type PizzaSize, type PizzaType } from '../constants/Pizza';

export interface PizzaDetailsResult {
  totalPrice: number;
  textDetaills: string;
}

const normalizeNumber = (value: number | null | undefined): value is number => typeof value === 'number';

export const getPizzaDetails = (
  type: PizzaType,
  size: PizzaSize,
  items: ProductItem[],
  ingredients: Ingredient[],
  selectedIngredients: Set<number>,
): PizzaDetailsResult => {
  const currentItem = items.find((item) => {
    if (normalizeNumber(item.pizzaType)) {
      return item.size === size && item.pizzaType === type;
    }

    return normalizeNumber(item.size) && item.size === size;
  });

  const ingredientsTotal = ingredients
    .filter((ingredient) => selectedIngredients.has(ingredient.id))
    .reduce((acc, ingredient) => acc + ingredient.price, 0);

  const basePrice = currentItem?.price ?? 0;
  const totalPrice = basePrice + ingredientsTotal;

  const sizeLabel = getVariantLabel(size);
  const hasPizzaType = items.some((item) => normalizeNumber(item.pizzaType));
  const typeLabel = hasPizzaType ? (Maptype[type] ?? 'Традиционное') : '';
  const ingredientCount = selectedIngredients.size;

  const ingredientText = ingredientCount
    ? `${ingredientCount} ${ingredientCount === 1 ? 'ингредиент' : ingredientCount < 5 ? 'ингредиента' : 'ингредиентов'}`
    : 'без добавок';

  const summary = hasPizzaType
    ? `${sizeLabel}, ${typeLabel} пицца, ингредиенты: ${ingredientText}`
    : `${sizeLabel}, ингредиенты: ${ingredientText}`;

  return {
    totalPrice,
    textDetaills: summary,
  };
};
