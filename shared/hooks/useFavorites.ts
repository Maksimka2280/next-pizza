import { useEffect, useState } from "react";
import { Api } from "../service/api-clients";

export function useFavoriteToggle(productId: number, initialFavorite = false) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const toggleFavorite = async () => {
    if (isSaving) return null;

    setIsSaving(true);
    try {
      if (isFavorite) {
        await Api.favorites.remove(productId);
      } else {
        await Api.favorites.add(productId);
      }

      const nextFavorite = !isFavorite;
      setIsFavorite(nextFavorite);
      return nextFavorite;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return { isFavorite, isSaving, toggleFavorite };
}