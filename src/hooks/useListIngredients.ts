
'use client'
import { Ingredient } from '@prisma/client';
import React, { useEffect, useState,  } from 'react';
import { Api } from '../../service/api-clients';
import {useSet} from 'react-use'

interface UseIngredientsResult {
  ingredients: Ingredient[];
  loading: boolean;
  selectedIds: Set<string>;
  toggleSelectedId: (id: string) => void;
}

export const useIngredients = (): UseIngredientsResult => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, { toggle }] = useSet(new Set <string>([]))
  useEffect(() => {
    async function fetchIngredients() {
      try {
        setLoading(true);
        const ingredients = await Api.ingredients.getAll();
        setIngredients(ingredients);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchIngredients();
  }, []);

  return {
    ingredients,
    loading,
    selectedIds,
    toggleSelectedId: (id: string) => toggle(id),
  };
};