'use client'

import PizzaPick from "@/components/main-page/filters-pick-pizza/filters-pick-pizza";
import MainFilters from "@/components/main-page/main-filters/main-filters";
import CartProducts from "@/components/Products/Cart-products";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <main className="px-[67px] pt-[40px]">
      <div>
        <h1 className="text-[36px] font-black pb-[20px]">Все пиццы</h1>
        <Suspense>
          <PizzaPick />
        </Suspense>
        <div className="mt-[35px] grid grid-cols-[280px_minmax(0,1fr)] gap-[50px]">
          <div className="w-full">
            <Suspense>
              <MainFilters />
            </Suspense>
          </div>

          <div className="flex w-full items-center justify-center">
            <div className="w-full ">
              <Suspense>
                <CartProducts />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
