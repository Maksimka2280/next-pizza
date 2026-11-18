"use client";

import Link from "next/link";
import ProductCartAction from "./ProductCartAction";
import { FavoriteButton } from "./FavoriteButton";
import type { ProductResponse } from "./productFilters";

type CatalogProductCardProps = {
    product: ProductResponse;
    isFavorite: boolean;
    onFavoriteChange: (isFavorite: boolean) => void;
};

export default function CatalogProductCard({
    product,
    isFavorite,
    onFavoriteChange,
}: CatalogProductCardProps) {
    const productName = product.name ?? "Вкусная пицца";
    const price = product.items?.[0]?.price ?? 449;
    const ingredientNames = product.ingredients?.map(({ name }) => name).filter(Boolean) ?? [];
    const ingredientText = `${ingredientNames.slice(0, 3).join(", ")}${ingredientNames.length > 3 ? "..." : ""}`;
    const productItemId = product.items?.[0]?.id;

    return (
        <div className="w-full min-w-0">
            <div className="flex flex-col">
                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[15px] bg-[#FFF7EE]">
                    <div className="relative flex h-[82%] w-[82%] items-center justify-center">
                        <Link href={`/product/${product.id}`} className="flex h-full w-full items-center justify-center">
                            {product.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={product.imageUrl}
                                    alt={productName}
                                    className="h-full w-full rounded-[30px] object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-[#B1B1B1]">
                                    Нет изображения
                                </div>
                            )}
                        </Link>
                    </div>
                    {product.id && (
                        <div className="absolute right-2 top-2">
                            <FavoriteButton
                                productId={product.id}
                                initialFavorite={isFavorite}
                                onFavoriteChange={onFavoriteChange}
                            />
                        </div>
                    )}
                </div>

                <Link href={`/product/${product.id}`}>
                    <h1 className="mb-[7px] mt-[15px] truncate text-[22px] font-bold">
                        {productName}
                    </h1>
                    <p className="h-[60px] max-w-full overflow-hidden break-words text-[14px] text-[#B1B1B1] line-clamp-3">
                        {ingredientText || "Описание появится после загрузки данных"}
                    </p>
                </Link>

                <div className="mt-3 flex items-center justify-between">
                    <p className="text-[20px]">
                        от <span className="text-[20px] font-bold">{price} ₴</span>
                    </p>
                    <ProductCartAction
                        productId={product.id}
                        productItemId={productItemId}
                    />
                </div>
            </div>
        </div>
    );
}
