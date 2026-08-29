
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
    const productPrice = product.items[0]?.price ?? 0;
    return (
        <>

            <div className="flex justify-center items-center mt-[50px] gap-20">

                <div className="flex flex-col gap-5 ">
                    {void console.log(product)}
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