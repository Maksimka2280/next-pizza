
import { prisma } from "../../../../../prisma/prisma-client";
import { ProductForm } from "../../../../../shared/components/shared/ProductForm";
import { pizzaTypes } from "../../../../../shared/constants/Pizza";



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

    if (!product) {
        return null;
    }
    const ingredientIds = product?.ingredients.map((ingredient) => ingredient.id);
    let recommendations = await prisma.product.findMany({
        where: {
            id: {
                not: product?.id,
            },
            categoryId: product?.categoryId,
            // ...(ingredientIds.length > 0 && {
            //     ingredients: {
            //         some: {
            //             id: {
            //                 in: ingredientIds,
            //             },
            //         },
            //     },
            // }),
        },
        include: {
            ingredients: true,
            items: true,
        },
        take: 10,
    });
    const productPrice = product.items[0]?.price ?? 0;
    return (
        <>

            <div className=" w-full mt-[50px]">
                <div className="flex gap-5 w-full justify-center items-center">
                    <ProductForm
                        name={product.name}
                        imageUrl={product.imageUrl}
                        ingredients={product.ingredients}
                        items={product.items}
                        categoryName={product.category.name}
                        pizzaTypes={pizzaTypes}
                        recommendations={recommendations}
                        price={productPrice}
                    />
                </div>
            </div>
        </>

    );
}