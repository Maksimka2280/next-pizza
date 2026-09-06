"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import { Skeleton } from "../ui/skeleton";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { useCart } from "../../hooks/useCart";
import {
  filterProducts,
  parseProductFilters,
  type ProductResponse,
} from "./productFilters";

export default function CartProducts() {
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseProductFilters(searchParams), [searchParams]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsPerPage = 8;
  const { cart, updateItem, addOrIncrement } = useCart();
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

  const filteredProducts = useMemo(() => filterProducts(products, filters), [products, filters]);

  useEffect(() => {
    setCurrentPage(0);
  }, [filteredProducts.length]);

  useEffect(() => {
    if (!isTransitioning) return;

    const timer = window.setTimeout(() => setIsTransitioning(false), 220);
    return () => window.clearTimeout(timer);
  }, [isTransitioning]);

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const visibleProducts = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredProducts]);

  const groupedVisibleProducts = useMemo(() => {
    const groups = new Map<string, ProductResponse[]>();

    visibleProducts.forEach((product) => {
      const categoryName = product.category?.name?.trim() || "Другие";
      const current = groups.get(categoryName) ?? [];
      current.push(product);
      groups.set(categoryName, current);
    });

    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b, "ru"));
  }, [visibleProducts]);

  const clearFilters = () => {
    const params = new URLSearchParams();
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  };
  return (
    <div className="flex flex-col gap-[30px] cursor-pointer">
      {loading ? (
        <div className={`flex flex-wrap gap-[50px] transition-all duration-300 ease-in-out ${isTransitioning ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="max-w-[285px] w-full animate-pulse">
              <div className="flex flex-col">
                <Skeleton className="h-[260px] w-[285px] rounded-[15px]" />
                <Skeleton className="mt-[15px] h-[24px] w-[70%] rounded-[8px]" />
                <Skeleton className="mt-[10px] h-[14px] w-full rounded-[8px]" />
                <Skeleton className="mt-[8px] h-[14px] w-[80%] rounded-[8px]" />
                <div className="mt-[18px] flex items-center justify-between">
                  <Skeleton className="h-[20px] w-[35%] rounded-[8px]" />
                  <Skeleton className="h-[40px] w-[125px] rounded-[15px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : groupedVisibleProducts.length > 0 ? (
        groupedVisibleProducts.map(([categoryName, products]) => (
          <div key={categoryName} className="flex flex-col gap-5">

            <h2 className="text-[28px] font-bold">{categoryName}</h2>
            <div className={`flex flex-wrap gap-[50px] transition-all duration-300 ease-in-out ${isTransitioning ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}>
              {products.map((product) => {
                const productName = product.name ?? "Вкусная пицца";
                const price = product.items?.[0]?.price ?? 449;
                const ingredients = product.ingredients
                  ?.map((ingredient) => ingredient.name)
                  .filter(Boolean)
                  .join(", ");

                const productItemId = product.items?.[0]?.id;
                const cartItem = cart?.items?.find(
                  (it) => it.productItem?.product?.id === product.id
                );
                const quantity = cartItem?.quantity ?? 0;

                return (
                  <Link
                    key={product.id ?? productName}
                    href={`/product/${product.id}`}
                  >
                    <div className="max-w-[285px] w-full">
                      <div className="flex flex-col">
                        <div className="flex h-[260px] w-[285px] items-center justify-center overflow-hidden rounded-[15px] bg-[#FFF7EE]">
                          <div className="h-[210px] w-[210px]">
                            {product.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
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

                        <h1 className="mt-[15px] mb-[7px] text-[22px] font-bold">
                          {productName}
                        </h1>

                        <p className="max-w-full break-words text-[14px] text-[#B1B1B1]">
                          {ingredients || "Опис буде доступний після отримання даних"}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-[20px]">
                            от <span className="text-[20px] font-bold">{price} ₽</span>
                          </p>
                          {!cartItem ? (
                            <button
                              className="h-[40px] w-[125px] rounded-[15px] bg-[#FFFAF4] text-[15px] font-bold text-[#FE5F00]"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!productItemId) return;
                                void addOrIncrement({ productItemId, quantity: 1 });
                              }}
                            >
                              + добавить
                            </button>
                          ) : null}


                          {cartItem ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                className="h-8 w-8 p-0 text-[#FF6900]"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();

                                  if (!cartItem || cartItem.id === undefined) return;

                                  const newQty = Math.max(1, (cartItem.quantity || 1) - 1);
                                  void updateItem({ cartItemId: cartItem.id, quantity: newQty });
                                }}
                              >
                                -
                              </Button>

                              <span className="w-5 text-center text-sm">{quantity}</span>
                              <Button
                                variant="outline"
                                className="h-8 w-8 p-0 text-[#FF6900]"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();

                                  if (!cartItem || cartItem.id === undefined) return;
                                  void updateItem({
                                    cartItemId: cartItem.id,
                                    quantity: (cartItem.quantity || 0) + 1,
                                  });
                                }}
                              >
                                +
                              </Button>
                            </div>
                          ) : null}


                        </div>
                      </div>
                    </div>
                  </Link>
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
