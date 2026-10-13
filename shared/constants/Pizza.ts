import { MapCoffeeSize } from './Coffee';
import { MapCocktailSize } from './Coctail';
import { MapNuggetsCount } from './Nuggets';

export type PizzaSize = 20 | 30 | 40;
export type PizzaType = 1 | 2;

export const Mapsize: Record<PizzaSize, string> = {
  20: 'Маленькая',
  30: 'Средняя',
  40: 'Большая',
};

export const Maptype: Record<PizzaType, string> = {
  1: 'Традиционное',
  2: 'Тонкое',
};

export const getVariantLabel = (value: number | string): string => {
  const normalized = Number(value);

  if (Object.prototype.hasOwnProperty.call(Mapsize, normalized)) {
    return Mapsize[normalized as PizzaSize];
  }

  if (Object.prototype.hasOwnProperty.call(MapCoffeeSize, normalized)) {
    return MapCoffeeSize[normalized as keyof typeof MapCoffeeSize];
  }

  if (Object.prototype.hasOwnProperty.call(MapCocktailSize, normalized)) {
    return MapCocktailSize[normalized as keyof typeof MapCocktailSize];
  }

  if (Object.prototype.hasOwnProperty.call(MapNuggetsCount, normalized)) {
    return MapNuggetsCount[normalized as keyof typeof MapNuggetsCount];
  }

  if (normalized === 1) return 'Міні';
  if (normalized === 2) return 'Стандарт';
  if (normalized === 3) return 'XL';

  if (Number.isFinite(normalized) && normalized > 0) {
    if (normalized >= 100) return `${normalized} мл`;
    return `${normalized} шт`;
  }

  return String(value);
};

export const pizzasize = Object.entries(Mapsize).map(([value, name]) => ({
  value,
  name,
}));

export const pizzaTypes = Object.entries(Maptype).map(([value, name]) => ({
  value,
  name,
}));