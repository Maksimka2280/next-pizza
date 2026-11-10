import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { unstable_cache } from "next/cache";
import { prisma } from "../../../prisma/prisma-client";
import PizzaPick from "../../../shared/components/main-page/filters-pick-pizza/filters-pick-pizza";
import MainFilters from "../../../shared/components/main-page/main-filters/main-filters";
import CartProducts from "../../../shared/components/Products/Cart-products";
import { Title } from "../../../shared/components/shared/Title";

const getCatalogProducts = unstable_cache(
  () =>
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
        items: { select: { id: true, price: true } },
        ingredients: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
    }),
  ["home-catalog-products"],
  { revalidate: 300 },
);

export default async function Page() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  const [products, favoriteRows] = await Promise.all([
    getCatalogProducts(),
    Number.isSafeInteger(userId) && userId > 0
      ? prisma.favorite.findMany({
          where: { userId },
          select: { productId: true },
        })
      : Promise.resolve([]),
  ]);
  const categories = Array.from(
    new Set(products.map(({ category }) => category.name)),
  ).sort((a, b) => a.localeCompare(b, "ru"));
  const ingredients = Array.from(
    new Map(
      products
        .flatMap(({ ingredients }) => ingredients)
        .map((ingredient) => [ingredient.id, ingredient]),
    ).values(),
  );

  return (
    <main className="w-full flex justify-center">
      <div className="w-full max-w-[1440px] py-[40px]">
        <div >
           <div className="flex items-center gap-[12px] pb-[45px]">
            <span className="block h-[40px] w-[7px] rounded-full bg-[#FE5F00]" />
            <Title text="Все пиццы" size="lg" className="font-black" />
          </div>

        <Suspense>
          <PizzaPick categories={categories} />
        </Suspense>
        </div>
       

        <div className="mt-[35px] grid grid-cols-[280px_minmax(0,1fr)] gap-[50px]">
          <div className="w-full">
            <Suspense>
              <MainFilters ingredients={ingredients} />
            </Suspense>
          </div>

           <div className="flex w-full items-center justify-center">
            <div className="w-full ">
              <Suspense>
                <CartProducts
                  initialProducts={products}
                  initialFavoriteIds={favoriteRows.map(({ productId }) => productId)}
                />
              </Suspense>
            </div>
            </div>
        </div>
      </div>
    </main>
  );
}
