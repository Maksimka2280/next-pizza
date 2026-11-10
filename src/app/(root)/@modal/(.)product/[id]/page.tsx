

import { prisma } from "../../../../../../prisma/prisma-client";
import { ChoosePizzaForm } from "../../../../../../shared/components/shared/Pizza-chosen-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";


export default async function ProductModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      ingredients: true,
      items: true,
      category: true,
    },
  });
  const session = await getServerSession(authOptions);

  if (!product) {
    return null;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/60">
      <div className="max-w-[1000px] w-full h-[580px] bg-[#F4F1EE] rounded-[30px] overflow-hidden">

        <div className="flex h-full">
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
