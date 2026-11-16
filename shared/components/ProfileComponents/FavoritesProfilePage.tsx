"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import type { FavoriteProduct } from "../../service/favorites";
import { FavoriteProducts } from "./FavoriteProducts";

export function FavoritesProfilePage({
  initialFavorites,
}: {
  initialFavorites: FavoriteProduct[];
}) {
  const [count, setCount] = useState(initialFavorites.length);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-r from-[#FE5F00] to-[#FF914D] p-6 text-white shadow-sm sm:flex-row sm:items-center sm:p-8">
        <div className="flex items-start gap-4">
          <span className="rounded-2xl bg-white/20 p-3">
            <Heart size={25} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white/80">Ваша коллекция</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Избранные товары
            </h1>
            <p className="mt-2 text-sm text-white/90">
              {count
                ? `Сохранено товаров: ${count}`
                : "Сохраняйте любимые блюда, чтобы быстро найти их позже."}
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#FE5F00] transition hover:bg-orange-50 sm:self-center"
        >
          <ArrowLeft size={17} aria-hidden="true" /> В меню
        </Link>
      </header>
      <FavoriteProducts
        initialFavorites={initialFavorites}
        onCountChange={() => setCount((current) => Math.max(0, current - 1))}
      />
    </section>
  );
}
