
import Link from "next/link";
import { SegmentedControl } from "@/components/ui/SegmentControl";
import CardIngredient from "@/components/Products/cart-ingridietns";
import { prisma } from "../../../../../../prisma/prisma-client";


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

  if (!product) {
    return null;
  }

  const price = product.items?.[0]?.price ?? 0;

  const description = product.ingredients
    ?.map((ingredient) => ingredient.name)
    .filter(Boolean)
    .join(", ");

  const productName = product.name ?? "Unnamed product";
  const productImage = product.imageUrl ?? "";



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/60">
      <div className="max-w-[1000px] w-full h-[580px] bg-[#F4F1EE] rounded-[30px] overflow-hidden">

        <div className="flex h-full">

          <div className="w-1/2 h-full flex items-center justify-center bg-white">
            <img
              src={productImage}
              alt={productName}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="w-1/2 h-full p-10 gap-2 flex flex-col">
            <div className="flex items-center justify-between ">
              <div>
                <h1 className="text-[24px] font-black">
                  {product?.name}
                </h1>

                <p className="text-[#777777] mt-2 text-[14px]">
                  25 см, традиційне тісто, 380 г
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F4F4] text-[20px] font-bold text-[#1F1F1F] transition hover:bg-[#EDEDED]"
              >
                ×
              </Link>
            </div>

              <SegmentedControl
                id="size"
                items={["Маленька", "Середня", "Велика"]}
              />

              <SegmentedControl
                id="dough"
                items={["Традиційне", "Тонке"]}
              />

              <h2 className="text-[18px] font-bold">
                Добавить по вкусу
              </h2>

              <div className="flex gap-4">
                {product?.ingredients.map((ingredient) => (
                  <CardIngredient
                    key={ingredient.id}
                    img={ingredient.imageUrl}
                    name={ingredient.name}
                    price={ingredient.price}
                    pricesize="sm"
                    titlesize="sm"
                  />
                ))}
              </div>
              <button className="bg-[#FF6900] text-white max-w-[420px] w-full h-[50px] rounded-[18px] hover:bg-[#e05a00] transition">
                Добавить в корзину
              </button>
            </div>
          </div>

        </div>

      </div>

  );
}
