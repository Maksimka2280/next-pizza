"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { FavoriteButton } from "../Products/FavoriteButton";
import ProductCartAction from "../Products/ProductCartAction";
import { useState } from "react";
import type { FavoriteProduct } from "../../service/favorites";

export function FavoriteProducts({
  initialFavorites,
  onCountChange,
}: {
  initialFavorites: FavoriteProduct[];
  onCountChange?: () => void;
}) {
  const [favorites, setFavorites] = useState(initialFavorites);

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-[#FED7AA] bg-white px-6 py-12 text-center shadow-sm">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-[#FFF0E7] text-[#FE5F00]">
          <Heart size={25} aria-hidden="true" />
        </span>
        <p className="mt-4 text-lg font-semibold text-[#292929]">
          Пока здесь пусто
        </p>
        <p className="mt-2 max-w-md text-sm text-[#707070]">
          Добавляйте понравившиеся товары в избранное, чтобы не потерять их.
        </p>
        <Link
          href="/"
          className="mt-5 rounded-xl bg-[#FE5F00] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e95600]"
        >
          Посмотреть меню
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((product) => (
        <div
          key={product.id}
          className="overflow-hidden rounded-3xl border border-[#F0ECE8] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#FFD2B8] hover:shadow-md"
        >
          <div className="flex flex-col">
            <div className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#FFF7EE]">
              <div className="relative flex h-full w-full items-center justify-center p-5">
                <Link
                  href={`/product/${product.id}`}
                  className="flex h-full w-full items-center justify-center"
                >
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#B1B1B1]">
                      Нет изображения
                    </div>
                  )}
                </Link>
              </div>
              <div className="absolute right-3 top-3">
                <FavoriteButton
                  productId={product.id}
                  initialFavorite
                  onFavoriteChange={(isFavorite) => {
                    if (!isFavorite) {
                      setFavorites((current) =>
                        current.filter((item) => item.id !== product.id),
                      );
                      onCountChange?.();
                    }
                  }}
                />
              </div>
            </div>

            <Link href={`/product/${product.id}`}>
              <h2 className="mt-4 truncate text-xl font-bold text-[#292929]">
                {product.name}
              </h2>
              <p className="mt-2 h-10 overflow-hidden break-words text-sm text-[#888] line-clamp-2">
                {product.ingredients.map(({ name }) => name).filter(Boolean).join(", ") ||
                  "Состав не указан"}
              </p>
            </Link>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0ECE8] pt-4">
              <p className="text-sm text-[#777]">
                от{" "}
                <span className="text-lg font-bold text-[#292929]">
                  {product.items[0]?.price ?? 449} ₴
                </span>
              </p>
              <ProductCartAction
                productId={product.id}
                productItemId={product.items[0]?.id}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}