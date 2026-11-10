
import { prisma } from "../../../../../prisma/prisma-client";
import { ProductForm } from "../../../../../shared/components/shared/ProductForm";
import { pizzaTypes } from "../../../../../shared/constants/Pizza";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";



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

    const session = await getServerSession(authOptions);

    if (!product) {
        return null;
    }
    const [recommendations, favoriteRows] = await Promise.all([
        prisma.product.findMany({
            where: {
                id: { not: product.id },
                categoryId: product.categoryId,
            },
            include: {
                ingredients: true,
                items: true,
            },
            take: 10,
        }),
        session?.user?.id
            ? prisma.favorite.findMany({
                where: { userId: Number(session.user.id) },
                select: { productId: true },
            })
            : Promise.resolve([]),
    ]);
    const productPrice = product.items[0]?.price ?? 0;
    const favoriteIds = favoriteRows.map(({ productId }) => productId);
    const isFavorite = favoriteIds.includes(product.id);
    return (
        <>

            <div className=" w-full mt-[50px]">
                <div className="flex gap-5 w-full justify-center items-center">
                    <ProductForm
                        name={product.name}
                        productId={product.id}
                        isFavorite={isFavorite}
                        imageUrl={product.imageUrl}
                        ingredients={product.ingredients}
                        items={product.items}
                        categoryName={product.category.name}
                        pizzaTypes={pizzaTypes}
                        recommendations={recommendations}
                        price={productPrice}
                        favoriteIds={favoriteIds}
                    />
                </div>
            </div>
        </>

    );
}