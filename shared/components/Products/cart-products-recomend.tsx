"use client";

import { useState } from "react";
import ReactPaginate from "react-paginate";
import RecommendationProductCard from "./RecommendationProductCard";

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
            <div className="grid grid-cols-1 justify-items-center gap-5 min-[420px]:grid-cols-2 sm:gap-6 xl:grid-cols-4">
                {visibleProducts.map((product) => {
                    return (
                        <RecommendationProductCard
                            key={product.id}
                            product={product}
                            isFavorite={favoriteIds.has(product.id)}
                            onFavoriteChange={(isFavorite) => {
                                setFavoriteIds((current) => {
                                    const next = new Set(current);
                                    if (isFavorite) next.add(product.id);
                                    else next.delete(product.id);
                                    return next;
                                });
                            }}
                        />
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