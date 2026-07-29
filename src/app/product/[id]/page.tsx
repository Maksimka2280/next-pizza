import { SegmentedControl } from "@/components/ui/SegmentControl";
import { prisma } from "../../../../prisma/prisma-client";
import CardIngredient from "@/components/Products/cart-ingridietns";
import CartProducts from "@/components/Products/Cart-products";
import RecommendationProducts from "@/components/Products/cart-products-recomend";



export default async function ProductPage({
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
    const ingredientIds = product?.ingredients.map((ingredient) => ingredient.id);
    let recommendations = await prisma.product.findMany({
        where: {
            id: {
                not: product?.id,
            },
            categoryId: product?.categoryId,
            ingredients: {
                some: {
                    id: {
                        in: ingredientIds,
                    },
                },
            },
        },
        include: {
            ingredients: true,
            items: true,
        },
        take: 4,
    });
    return (
        <>
            <div className="flex justify-center items-center mt-[100px] gap-20">
                <div className="w-[570px] h-[570px] rounded-[20px] p-[40px] bg-[#FFF7EE] flex items-center justify-center overflow-hidden">
                    <img
                        src={product?.imageUrl}
                        alt={product?.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-[20px]"
                    />
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-[34px] font-black">
                            {product?.name}
                        </h1>

                        <p className="text-[#777777] mt-2">
                            25 см, традиційне тісто, 380 г
                        </p>
                    </div>

                    <SegmentedControl
                        id="size"
                        items={["Маленька", "Середня", "Велика",]}
                    />

                    <SegmentedControl
                        id="dough"
                        items={["Традиційне", "Тонке"]}
                    />
                    <h2 className="text-[18px] font-bold">Ингредиенты</h2>

                    <div className="flex gap-4">
                        {product?.ingredients.map((ingredient) => (
                            <CardIngredient
                                key={ingredient.id}
                                img={ingredient.imageUrl}
                                name={ingredient.name}
                                price={ingredient.price}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-20 flex justify-center">
                <div className="">
                    <h2 className="mb-8 text-[28px] font-bold">
                        Рекомендації
                    </h2>

                    <RecommendationProducts products={recommendations} />
                </div>
            </div>
        </>

    );
}