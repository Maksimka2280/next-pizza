'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ProductItem } from '@prisma/client';
import { getVariantLabel, pizzaTypes, type PizzaSize, type PizzaType } from '../constants/Pizza';

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
    ).sort((a, b) => a - b);

    return sizeValues.map((size) => ({
      name: getVariantLabel(size),
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

  const availableTypeOptions = useMemo(
    () => pizzaTypes.filter((item) => availableTypes.includes(Number(item.value) as PizzaType)),
    [availableTypes],
  );

  const defaultSize = (availableSizes[0]?.value ? Number(availableSizes[0].value) : 20) as PizzaSize;
  const defaultType = (availableTypes[0] ?? 1) as PizzaType;

  const [size, setSize] = useState<PizzaSize>(defaultSize);
  const [type, setType] = useState<PizzaType>(defaultType);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(new Set());

  const currentItemId = useMemo<number | null>(() => {
    const matchingItem = items.find((item) => {
      if (normalizeNumber(item.pizzaType)) {
        return item.size === size && item.pizzaType === type;
      }

      return normalizeNumber(item.size) && item.size === size;
    });

    return matchingItem?.id ?? null;
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

  const availablePizzaSizes = availableSizes.map((item) => ({
    name: item.name,
    value: item.value,
    disabled: availableTypes.length > 0
      ? !items.some(
          (variant) => variant.size === Number(item.value) && variant.pizzaType === type,
        )
      : false,
  }));

  useEffect(() => {
    if (!availableTypes.length) {
      return;
    }

    const currentSize = availablePizzaSizes.find((item) => Number(item.value) === size);

    if (currentSize?.disabled) {
      const firstAvailableSize = availablePizzaSizes.find((item) => !item.disabled);

      if (firstAvailableSize) {
        setSize(Number(firstAvailableSize.value) as PizzaSize);
      }
    }
  }, [type, availablePizzaSizes, availableTypes.length, size]);

  return {
    size,
    type,
    selectedIngredients,
    availableSizes,
    currentItemId,
    setSize,
    setType,
    addIngredient,
    availablePizzaSizes,
    availableTypeOptions,
    hasTypeSelector: availableTypeOptions.length > 0,
  };
};
