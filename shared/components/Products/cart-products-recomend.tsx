"use client";

import Link from "next/link";
import { useState } from "react";
import ReactPaginate from "react-paginate";

type ProductResponse = {
    id: number;
    name: string;
    imageUrl: string;
    items: Array<{ price: number }>;
    ingredients: Array<{ name: string }>;
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

                    const ingredients = product.ingredients
                        ?.map((ingredient) => ingredient.name)
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

                                <p className="text-[14px] text-[#B1B1B1]">
                                    {ingredients}
                                </p>

                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-[20px]">
                                        від{" "}
                                        <span className="font-bold">
                                            {price} ₽
                                        </span>
                                    </p>

                                    <button
                                        onClick={(e) =>
                                            e.preventDefault()
                                        }
                                        className="h-[40px] w-[125px] rounded-[15px] bg-[#FFFAF4] text-[15px] font-bold text-[#FE5F00] transition hover:bg-[#FE5F00] hover:text-white"
                                    >
                                        + додати
                                    </button>
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