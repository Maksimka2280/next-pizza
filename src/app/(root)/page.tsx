'use client'


import { Suspense } from "react";
import PizzaPick from "../../../shared/components/main-page/filters-pick-pizza/filters-pick-pizza";
import MainFilters from "../../../shared/components/main-page/main-filters/main-filters";
import CartProducts from "../../../shared/components/Products/Cart-products";
import { Title } from "../../../shared/components/shared/Title";

export default function Dashboard() {
  return (
    <main className="w-full flex justify-center">
      <div className="w-full max-w-[1440px] py-[40px]">
        <div >
           <div className="flex items-center gap-[12px] pb-[45px]">
            <span className="block h-[40px] w-[7px] rounded-full bg-[#FE5F00]" />
            <Title text="Все пиццы" size="lg" className="font-black" />
          </div>

        <Suspense>
          <PizzaPick />
        </Suspense>
        </div>
       

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
