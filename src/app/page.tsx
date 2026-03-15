
import Header from "@/components/headers/Header";
import PizzaPick from "@/components/main-page/filters-pick-pizza/filters-pick-pizza";
import MainFilters from "@/components/main-page/main-filters/main-filters";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Header />
      <main className="px-[67px] pt-[40px]">
        <div>
          <h1 className="text-[36px] font-black pb-[20px]">Все пиццы</h1>
          <PizzaPick />
          <div className="mt-[35px]">
             <MainFilters/>
          </div>
         
        </div>
      </main>
    </>
  );
}
