"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";

type ProductResponse = {
  id?: number;
  name?: string;
  imageUrl?: string;
  items?: Array<{ price?: number }>;
  ingredients?: Array<{ name?: string }>;
};

export default function CartProducts() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get<ProductResponse[]>("/api/products");
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [products.length]);

  useEffect(() => {
    if (!isTransitioning) return;

    const timer = window.setTimeout(() => setIsTransitioning(false), 220);
    return () => window.clearTimeout(timer);
  }, [isTransitioning]);

  const pageCount = Math.ceil(products.length / itemsPerPage);

  const visibleProducts = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, products]);

  return (
    <div className="flex flex-col gap-[30px] cursor-pointer" >
      <div
        className={`flex flex-wrap gap-[50px] transition-all duration-300 ease-in-out ${isTransitioning ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
          }`}
      >
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="max-w-[285px] w-full animate-pulse">
              <div className="flex flex-col">
                <div className="flex h-[260px] w-[285px] items-center justify-center overflow-hidden rounded-[15px] bg-[#F4ECE4]" />
                <div className="mt-[15px] h-[24px] w-[70%] rounded-[8px] bg-[#F4ECE4]" />
                <div className="mt-[10px] h-[14px] w-full rounded-[8px] bg-[#F4ECE4]" />
                <div className="mt-[8px] h-[14px] w-[80%] rounded-[8px] bg-[#F4ECE4]" />
                <div className="mt-[18px] flex items-center justify-between">
                  <div className="h-[20px] w-[35%] rounded-[8px] bg-[#F4ECE4]" />
                  <div className="h-[40px] w-[125px] rounded-[15px] bg-[#F4ECE4]" />
                </div>
              </div>
            </div>
          ))
        ) : (
          visibleProducts.map((product) => {
            const productName = product.name ?? "Вкусная пицца";
            const price = product.items?.[0]?.price ?? 449;
            const ingredients = product.ingredients
              ?.map((ingredient) => ingredient.name)
              .filter(Boolean)
              .join(", ");

            return (
              <div key={product.id ?? productName} className="max-w-[285px] w-full">
                <div className="flex flex-col">
                  <div className="flex h-[260px] w-[285px] items-center justify-center overflow-hidden rounded-[15px] bg-[#FFF7EE]">
                    <div className="h-[210px] w-[210px]">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={productName}
                          className="h-full w-full rounded-[30px] object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#B1B1B1]">
                          Немає зображення
                        </div>
                      )}
                    </div>
                  </div>

                  <h1 className="mt-[15px] mb-[7px] text-[22px] font-bold">{productName}</h1>

                  <p className="max-w-full break-words text-[14px] text-[#B1B1B1]">
                    {ingredients || "Опис буде доступний після отримання даних"}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-[20px]">
                      от <span className="text-[20px] font-bold">{price} ₽</span>
                    </p>
                    <button className="h-[40px] w-[125px] rounded-[15px] bg-[#FFFAF4] text-[15px] font-bold text-[#FE5F00] transition-all duration-300 ease-in-out hover:bg-[#FE5F00] hover:text-[#FFFAF4]">
                      + добавить
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}


      </div>
      <div className="flex justify-start items-center my-[50px]">
        {!loading && pageCount > 1 && (
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
            containerClassName="flex items-center justify-center gap-2"
            pageClassName="h-[45px] w-[45px] rounded-[15px] border border-[#F0F0F0] text-[#EDEDED] transition-all duration-300 ease-in-out cursor-pointer hover:border-[#FE5F00] hover:text-[#FE5F00]"
            pageLinkClassName="flex h-full w-full items-center justify-center text-sm font-semibold text-[#888888] transition-colors duration-300 ease-in-out cursor-pointer"
            activeClassName="bg-[#FE5F00]"
            activeLinkClassName="text-white"
            previousClassName="flex h-[45px] w-[45px] items-center justify-center rounded-[15px] border border-[#F0F0F0] text-[#EDEDED] transition-all duration-300 ease-in-out cursor-pointer hover:border-[#FE5F00] hover:text-[#FE5F00]"
            nextClassName="flex h-[45px] w-[45px] items-center justify-center rounded-[15px] border border-[#F0F0F0] text-[#EDEDED] transition-all duration-300 ease-in-out cursor-pointer hover:border-[#FE5F00] hover:text-[#FE5F00]"
            disabledClassName="cursor-not-allowed opacity-50"
            breakClassName="flex h-[45px] w-[45px] items-center justify-center text-sm text-[#B1B1B1]"
          />
        )}
      </div>

    </div>
  );
}
