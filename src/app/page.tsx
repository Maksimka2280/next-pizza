
import PizzaPick from "@/components/main-page/filters-pick-pizza/filters-pick-pizza";
import MainFilters from "@/components/main-page/main-filters/main-filters";
import CartProducts from "@/components/Products/Cart-products";;

export default function Home() {
  return (
    <>
      <main className="px-[67px] pt-[40px]">
        <div>
            <h1 className="text-[36px] font-black pb-[20px]">Все пиццы</h1>
            <PizzaPick />
          <div className="mt-[35px] flex gap-[50px]">
            <MainFilters />
            <CartProducts />
          </div>

        </div>
      </main>
    </>
  );
}
