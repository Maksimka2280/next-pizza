'use client';

import { useMemo, useState } from 'react';
import type { ProductItem } from '@prisma/client';
import { Mapsize, Maptype, type PizzaSize, type PizzaType } from '../constants/Pizza';

interface Variant {
  name: string;
  value: string;
  disabled?: boolean;
}

const normalizeNumber = (value: number | null | undefined): value is number => typeof value === 'number';

export const usePizzaOptions = (items: ProductItem[]) => {
  const availableSizes = useMemo<Variant[]>(() => {
    const sizeValues = Array.from(
      new Set(
        items
          .filter((item): item is ProductItem & { size: number } => normalizeNumber(item.size))
          .map((item) => item.size),
      ),
    ).sort((a, b) => a - b) as PizzaSize[];

    return sizeValues.map((size) => ({
      name: Mapsize[size] ?? `${size} см`,
      value: String(size),
    }));
  }, [items]);

  const availableTypes = useMemo<PizzaType[]>(() => {
    const typeValues = Array.from(
      new Set(
        items
          .filter((item): item is ProductItem & { pizzaType: number } => normalizeNumber(item.pizzaType))
          .map((item) => item.pizzaType),
      ),
    ).sort((a, b) => a - b) as PizzaType[];

    return typeValues;
  }, [items]);

  const defaultSize = (availableSizes[0]?.value ? (Number(availableSizes[0].value) as PizzaSize) : 20) as PizzaSize;
  const defaultType = (availableTypes[0] ?? 1) as PizzaType;

  const [size, setSize] = useState<PizzaSize>(defaultSize);
  const [type, setType] = useState<PizzaType>(defaultType);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(new Set());

  const currentItemId = useMemo<number | null>(() => {
    const item = items.find(
      (item) => normalizeNumber(item.size) && normalizeNumber(item.pizzaType) && item.size === size && item.pizzaType === type,
    );

    return item?.id ?? null;
  }, [items, size, type]);

  const addIngredient = (ingredientId: number) => {
    setSelectedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(ingredientId)) {
        next.delete(ingredientId);
      } else {
        next.add(ingredientId);
      }
      return next;
    });
  };

  return {
    size,
    type,
    selectedIngredients,
    availableSizes,
    currentItemId,
    setSize,
    setType,
    addIngredient,
  };
};
