"use client";

import Link from "next/link";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import ProductCartAction from "./ProductCartAction";

type ProductResponse = {
    id: number;
    name: string;
    imageUrl: string;
    items?: Array<{ id?: number; price?: number; product?: { id?: number } }>;
    ingredients?: Array<{ name?: string }>;
};

interface RecommendationProductsProps {
    products: ProductResponse[];
}

export default function RecommendationProducts({
    products,
}: RecommendationProductsProps) {
    const [currentPage, setCurrentPage] = useState(0);

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
                        <Link
                            href={`/product/${product.id}`}
                            key={product.id}
                            className="w-[285px]"
                        >
                            <div className="flex cursor-pointer flex-col">
                                <div className="flex h-[260px] w-[285px] items-center justify-center overflow-hidden rounded-[15px] bg-[#FFF7EE]">
                                    <div className="h-[210px] w-[210px]">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="h-full w-full rounded-[30px] object-cover transition hover:scale-105"
                                        />
                                    </div>
                                </div>

                                <h2 className="mb-[7px] mt-[15px] text-[22px] font-bold">
                                    {product.name}
                                </h2>

                                <p className="text-[14px] h-[60px] text-[#B1B1B1]">
                                    {ingredients || "Опис буде доступний після отримання даних"}
                                </p>

                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-[20px]">
                                        від{" "}
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
                        </Link>
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