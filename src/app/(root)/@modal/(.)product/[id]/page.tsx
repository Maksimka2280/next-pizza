

import { notFound } from "next/navigation";
import { prisma } from "../../../../../../prisma/prisma-client";
import { ChoosePizzaForm } from "../../../../../../shared/components/shared/Pizza-chosen-form";
import { ProductModalCloseButton } from "../../../../../../shared/components/shared/ProductModalCloseButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";


export default async function ProductModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isSafeInteger(productId) || productId <= 0) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      ingredients: true,
      items: true,
      category: true,
    },
  });
  const session = await getServerSession(authOptions);

  if (!product) {
    notFound();
  }
  const productName = product.name ?? "Unnamed product";
  const productImage = product.imageUrl ?? "";
  const productPrice = product.items[0]?.price ?? 0;
  const isFavorite = session?.user?.id
    ? Boolean(await prisma.favorite.findUnique({
        where: {
          userId_productId: {
            userId: Number(session.user.id),
            productId: product.id,
          },
        },
        select: { id: true },
      }))
    : false;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4">
      <div className="relative max-h-[calc(100dvh-1rem)] w-full max-w-[1000px] sm:max-h-[calc(100dvh-2rem)]">
        <ProductModalCloseButton />
        <div className="max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-2xl bg-[#F4F1EE] sm:max-h-[calc(100dvh-2rem)] sm:rounded-[30px]">
          <ChoosePizzaForm
            productId={product.id}
            isFavorite={isFavorite}
            name={productName}
            imageUrl={productImage}
            ingredients={product.ingredients}
            items={product.items}
            price={productPrice}
          />
        </div>
      </div>

    </div>

  );
}
