"use client";

import ReactPaginate from "react-paginate";
import { Toaster } from "react-hot-toast";
import { useCardFilters } from "../../hooks/useCardFilters";
import { useState } from "react";
import CatalogProductCard from "./CatalogProductCard";
import type { ProductResponse } from "./productFilters";

type CartProductsProps = {
  initialProducts: ProductResponse[];
  initialFavoriteIds: number[];
};

export default function CartProducts({
  initialProducts,
  initialFavoriteIds,
}: CartProductsProps) {
  const [favoriteIds, setFavoriteIds] = useState(() => new Set(initialFavoriteIds));
  const { 
    groupedVisibleProducts,
    filters,
    clearFilters,
    pageCount,
    setIsTransitioning,
    setCurrentPage,
    isTransitioning,
    currentPage     } = useCardFilters(initialProducts)

  return (
    <div className="flex flex-col gap-[30px] cursor-pointer">
      {groupedVisibleProducts.length > 0 ? (
        groupedVisibleProducts.map(([categoryName, products]) => (
          <div key={categoryName} className="flex flex-col gap-5">

            <h2 className="text-[28px] font-bold">{categoryName}</h2>
            <div className={`grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:grid-cols-4 ${isTransitioning ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}>
              {products.map((product) => {
                return (
                  <CatalogProductCard
                    key={product.id ?? product.name}
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
          </div>

        ))
      ) : (
        <div className="w-full flex items-center justify-center">
          <div className="flex max-w-[500px] w-full flex-col items-center justify-center rounded-[20px] border border-dashed border-[#FE5F00] px-8 py-10 text-center">
            <div className="mb-3 text-4xl">🍕</div>
            <h3 className="text-xl font-bold text-[#1F1F1F]">{filters.categoryQuery || "Пицца"} спряталась 😔</h3>
            <p className="mt-2 max-w-[320px] text-sm leading-5 text-[#7A7A7A]">
              Мы не нашли подходящих вариантов. Попробуйте изменить фильтры — вдруг найдём ту самую!
            </p>
            <button
              className="mt-5 rounded-full bg-[#FF6900] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#e85f00]"
              onClick={clearFilters}
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-start items-center my-[50px]">
        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={({ selected }) => {
              setIsTransitioning(true);
              setCurrentPage(selected);
            }}
            forcePage={currentPage}
            containerClassName="flex max-w-full flex-wrap items-center justify-center gap-1 sm:gap-2"
            pageClassName="h-9 w-9 cursor-pointer rounded-[15px] border border-[#F0F0F0] text-[#EDEDED] transition-all duration-300 ease-in-out hover:border-[#FE5F00] hover:text-[#FE5F00] sm:h-[45px] sm:w-[45px]"
            pageLinkClassName="flex h-full w-full items-center justify-center text-sm font-semibold text-[#888888] transition-colors duration-300 ease-in-out cursor-pointer"
            activeClassName="bg-[#FE5F00]"
            activeLinkClassName="text-white"
            previousClassName="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[15px] border border-[#F0F0F0] text-[#EDEDED] transition-all duration-300 ease-in-out hover:border-[#FE5F00] hover:text-[#FE5F00] sm:h-[45px] sm:w-[45px]"
            nextClassName="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[15px] border border-[#F0F0F0] text-[#EDEDED] transition-all duration-300 ease-in-out hover:border-[#FE5F00] hover:text-[#FE5F00] sm:h-[45px] sm:w-[45px]"
            disabledClassName="cursor-not-allowed opacity-50"
            breakClassName="flex h-[45px] w-[45px] items-center justify-center text-sm text-[#B1B1B1]"
          />
        )}
        <Toaster position="top-center" />
      </div>
    </div>
  );
}
