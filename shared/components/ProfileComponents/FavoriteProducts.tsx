"use client";

import Link from "next/link";
import { FavoriteButton } from "../Products/FavoriteButton";
import ProductCartAction from "../Products/ProductCartAction";
import { useState } from "react";
import type { FavoriteProduct } from "../../service/favorites";

export function FavoriteProducts({
  initialFavorites,
}: {
  initialFavorites: FavoriteProduct[];
}) {
  const [favorites, setFavorites] = useState(initialFavorites);

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#FED7AA] bg-[#FFFAF5] px-6 py-12 text-center">
        <p className="text-lg font-semibold text-[#292929]">Пока здесь пусто</p>
        <p className="mt-2 text-sm text-[#707070]">
          Добавляйте понравившиеся товары в избранное, чтобы не потерять их.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-[50px]">
      {favorites.map((product) => (
        <div
          key={product.id}
          className="w-full max-w-[285px] rounded-[15px] bg-white p-3"
        >
          <div className="flex flex-col">
            <div className="relative flex h-[260px] w-full items-center justify-center overflow-hidden rounded-[15px] bg-[#FFF7EE]">
              <div className="relative flex h-[210px] w-[210px] items-center justify-center">
                <Link
                  href={`/product/${product.id}`}
                  className="flex h-[190px] w-[190px] items-center justify-center"
                >
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full rounded-[30px] object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#B1B1B1]">
                      Нет изображения
                    </div>
                  )}
                </Link>
              </div>
              <div className="absolute right-2 top-2">
                <FavoriteButton
                  productId={product.id}
                  initialFavorite
                  onFavoriteChange={(isFavorite) => {
                    if (!isFavorite) {
                      setFavorites((current) =>
                        current.filter((item) => item.id !== product.id),
                      );
                    }
                  }}
                />
              </div>
            </div>

            <Link href={`/product/${product.id}`}>
              <h2 className="mt-[15px] mb-[7px] truncate text-[22px] font-bold">
                {product.name}
              </h2>
              <p className="max-w-full h-[60px] break-words text-[14px] text-[#B1B1B1]">
                {product.ingredients.map(({ name }) => name).filter(Boolean).join(", ") ||
                  "Описание появится после загрузки данных"}
              </p>
            </Link>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-[20px]">
                от{" "}
                <span className="text-[20px] font-bold">
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