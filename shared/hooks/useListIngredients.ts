
'use client'
import {useSet} from 'react-use'

interface UseIngredientsResult {
  toggleSelectedId: (id: string) => void;
}

export const useIngredients = (): UseIngredientsResult => {
  const [selectedIds, { toggle }] = useSet(new Set <string>([]))


  return {
    toggleSelectedId: (id: string) => toggle(id),
  };
};