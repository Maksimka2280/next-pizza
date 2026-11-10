"use client";

import Link from "next/link";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import ProductCartAction from "./ProductCartAction";
import { FavoriteButton } from "./FavoriteButton";

type ProductResponse = {
    id: number;
    name: string;
    imageUrl: string;
    items?: Array<{ id?: number; price?: number; product?: { id?: number } }>;
    ingredients?: Array<{ name?: string }>;
};

interface RecommendationProductsProps {
    products: ProductResponse[];
    favoriteIds: number[];
}

export default function RecommendationProducts({
    products,
    favoriteIds: initialFavoriteIds,
}: RecommendationProductsProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [favoriteIds, setFavoriteIds] = useState(() => new Set(initialFavoriteIds));

    const productsPerPage = 4;

    const pageCount = Math.ceil(products.length / productsPerPage);

    const visibleProducts = products.slice(
        currentPage * productsPerPage,
        currentPage * productsPerPage + productsPerPage
    );

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-wrap justify-center gap-[50px]">
                {visibleProducts.map((product) => {
                    const price = product.items?.[0]?.price ?? 0;
                    const productItemId = product.items?.[0]?.id;

                    const ingredients = product.ingredients
                        ?.map((ingredient) => ingredient.name)
                        .filter(Boolean)
                        .join(", ");

                    return (
                        <article key={product.id} className="relative w-[285px]">
                            <div className="flex flex-col">
                                <div className="relative flex h-[260px] w-[285px] items-center justify-center overflow-hidden rounded-[15px] bg-[#FFF7EE]">
                                    <Link href={`/product/${product.id}`} className="flex h-[210px] w-[210px] items-center justify-center">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="h-full w-full rounded-[30px] object-cover transition hover:scale-105"
                                        />
                                    </Link>
                                    <div className="absolute right-3 top-3">
                                        <FavoriteButton
                                            productId={product.id}
                                            initialFavorite={favoriteIds.has(product.id)}
                                            onFavoriteChange={(isFavorite) => {
                                                setFavoriteIds((current) => {
                                                    const next = new Set(current);
                                                    if (isFavorite) next.add(product.id);
                                                    else next.delete(product.id);
                                                    return next;
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <Link href={`/product/${product.id}`}>
                                    <h2 className="mb-[7px] mt-[15px] truncate text-[22px] font-bold">
                                        {product.name}
                                    </h2>

                                    <p className="h-[60px] text-[14px] text-[#B1B1B1]">
                                        {ingredients || "Описание появится после загрузки данных"}
                                    </p>
                                </Link>

                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-[20px]">
                                        От{" "}
                                        <span className="font-bold">
                                            {price} ₴
                                        </span>
                                    </p>

                                    <ProductCartAction
                                        productId={product.id}
                                        productItemId={productItemId}
                                    />
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {pageCount > 1 && (
                <div className="flex justify-center">
                    <ReactPaginate
                        previousLabel={"←"}
                        nextLabel={"→"}
                        pageCount={pageCount}
                        onPageChange={({ selected }) =>
                            setCurrentPage(selected)
                        }
                        forcePage={currentPage}
                        containerClassName="flex items-center gap-3"
                        pageClassName="
                            h-[45px]
                            w-[45px]
                            rounded-[15px]
                            border
                            border-[#F0F0F0]
                            flex
                            items-center
                            justify-center
                            cursor-pointer
                        "
                        activeClassName="bg-[#FE5F00]"
                        activeLinkClassName="text-white"
                        pageLinkClassName="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            text-[#888]
                            font-semibold
                        "
                        previousClassName="
                            flex
                            h-[45px]
                            w-[45px]
                            items-center
                            justify-center
                            rounded-[15px]
                            bg-[#FE5F00]
                            text-white
                            cursor-pointer
                        "
                        nextClassName="
                            flex
                            h-[45px]
                            w-[45px]
                            items-center
                            justify-center
                            rounded-[15px]
                            bg-[#FE5F00]
                            text-white
                            cursor-pointer
                        "
                    />
                </div>
            )}
        </div>
    );
}