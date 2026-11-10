"use client";

import { useSession } from "next-auth/react";
import { Heart, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useFavoriteToggle } from "../../hooks/useFavorites";

type FavoriteButtonProps = {
  productId: number;
  initialFavorite?: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
};

export function FavoriteButton({
  productId,
  initialFavorite = false,
  onFavoriteChange,
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const { isFavorite, isSaving, toggleFavorite } = useFavoriteToggle(productId, initialFavorite);

  if (status !== "authenticated" || !session?.user?.id) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      aria-pressed={isFavorite}
      aria-busy={isSaving}
      disabled={isSaving}
      onClick={async () => {
        const nextFavorite = await toggleFavorite();
        if (nextFavorite === null) {
          toast.error("Не удалось изменить избранное. Попробуйте ещё раз.");
          return;
        }

        onFavoriteChange?.(nextFavorite);
        toast.success(
          nextFavorite ? "Добавлено в избранное" : "Удалено из избранного",
        );
      }}
      className="flex size-10 items-center justify-center rounded-full bg-white text-[#FE5F00] shadow-md ring-1 ring-black/5 transition hover:scale-110 hover:bg-[#FFF7EE] disabled:opacity-60"
    >
      {isSaving ? (
        <LoaderCircle className="animate-spin" size={20} />
      ) : (
        <Heart className={isFavorite ? "fill-current" : ""} size={20} />
      )}
    </button>
  );
}