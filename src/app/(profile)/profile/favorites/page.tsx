import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { prisma } from "../../../../../prisma/prisma-client";
import { FavoriteProducts } from "../../../../../shared/components/ProfileComponents/FavoriteProducts";
import type { FavoriteProduct } from "../../../../../shared/service/favorites";

const favoriteProductSelect = {
  id: true,
  name: true,
  imageUrl: true,
  items: { select: { id: true, price: true }, orderBy: { price: "asc" }, take: 1 },
  category: { select: { name: true } },
  ingredients: { select: { name: true } },
} satisfies Prisma.ProductSelect;

type FavoriteProductRow = Prisma.ProductGetPayload<{
  select: typeof favoriteProductSelect;
}>;

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const userId = Number(session.user.id);
  const favoriteRows = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { productId: true },
  });
  const productIds = favoriteRows.map(({ productId }) => productId);
  const products: FavoriteProductRow[] = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: favoriteProductSelect,
      })
    : [];
  const productsById = new Map<number, FavoriteProduct>(
    products.map((product) => [product.id, product]),
  );
  const favorites = productIds.flatMap((productId) => {
    const product = productsById.get(productId);
    return product ? [product] : [];
  });

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Избранные товары</h1>
      <FavoriteProducts initialFavorites={favorites} />
    </section>
  );
}