"use client";

import Link from "next/link";
import ProductCartAction from "./ProductCartAction";
import { FavoriteButton } from "./FavoriteButton";

type Product = {
    id: number;
    name: string;
    imageUrl: string;
    items?: Array<{ id?: number; price?: number }>;
    ingredients?: Array<{ name?: string }>;
};

interface RecommendationProductCardProps {
    product: Product;
    isFavorite: boolean;
    onFavoriteChange: (isFavorite: boolean) => void;
}

export default function RecommendationProductCard({
    product,
    isFavorite,
    onFavoriteChange,
}: RecommendationProductCardProps) {
    const price = product.items?.[0]?.price ?? 0;
    const productItemId = product.items?.[0]?.id;
    const ingredients = product.ingredients
        ?.map((ingredient) => ingredient.name)
        .filter(Boolean)
        .join(", ");

    return (
        <article className="relative w-full min-w-0 max-w-[360px]">
            <div className="flex flex-col">
                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[15px] bg-[#FFF7EE]">
                    <Link href={`/product/${product.id}`} className="flex h-[82%] w-[82%] items-center justify-center">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full rounded-[30px] object-cover transition hover:scale-105"
                        />
                    </Link>
                    <div className="absolute right-3 top-3">
                        <FavoriteButton
                            productId={product.id}
                            initialFavorite={isFavorite}
                            onFavoriteChange={onFavoriteChange}
                        />
                    </div>
                </div>

                <Link href={`/product/${product.id}`}>
                    <h2 className="mb-[7px] mt-[15px] truncate text-[22px] font-bold">
                        {product.name}
                    </h2>
                    <p className="h-[60px] overflow-hidden break-words text-[14px] text-[#B1B1B1] line-clamp-3">
                        {ingredients || "Описание появится после загрузки данных"}
                    </p>
                </Link>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[20px]">
                        От <span className="font-bold">{price} ₴</span>
                    </p>
                    <ProductCartAction
                        productId={product.id}
                        productItemId={productItemId}
                    />
                </div>
            </div>
        </article>
    );
}
