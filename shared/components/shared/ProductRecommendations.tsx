import type { Ingredient, Product, ProductItem } from "@prisma/client";
import RecommendationProducts from "../Products/cart-products-recomend";

type RecommendedProduct = Product & {
    ingredients: Ingredient[];
    items: ProductItem[];
};

interface ProductRecommendationsProps {
    products: RecommendedProduct[];
    favoriteIds: number[];
}

export function ProductRecommendations({
    products,
    favoriteIds,
}: ProductRecommendationsProps) {
    if (products.length === 0) return null;

    return (
        <section className="mt-12 pb-12 sm:mt-16 sm:pb-16 lg:mt-20 lg:pb-20">
            <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-[28px]">
                Рекомендации
            </h2>
            <RecommendationProducts
                products={products}
                favoriteIds={favoriteIds}
            />
        </section>
    );
}
