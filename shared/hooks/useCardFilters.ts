import { useEffect, useMemo, useState } from "react";
import { filterProducts, parseProductFilters, ProductResponse } from "../components/Products/productFilters";
import { useSearchParams } from "next/navigation";
import { Api } from "../service/api-clients";

export const useCardFilters = () => {
    const searchParams = useSearchParams();
    const filters = useMemo(() => parseProductFilters(searchParams), [searchParams]);
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const itemsPerPage = 8;
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await Api.products.getAll();
                setProducts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        setCurrentPage(0);
    }, [products.length]);
    const getProductPrice = (product: ProductResponse): number => {
        const prices = product.items
            ?.map((item) => item.price)
            .filter((price): price is number => price !== undefined);

        if (!prices?.length) return 0;

        return Math.min(...prices);
    };
    const filteredProducts = useMemo(
        () => filterProducts(products, filters),
        [products, filters]
    );

    const sortBy = searchParams.get("sortBy") ?? "популярность";

    const sortedProducts = useMemo(() => {
        const result = [...filteredProducts];

        switch (sortBy) {
            case "дешевле":
                return result.sort(
                    (a, b) => getProductPrice(a) - getProductPrice(b)
                );

            case "дороже":
                return result.sort(
                    (a, b) => getProductPrice(b) - getProductPrice(a)
                );

            default:
                return result;
        }
    }, [filteredProducts, sortBy]);
    useEffect(() => {
        setCurrentPage(0);
    }, [filteredProducts.length, sortBy]);

    useEffect(() => {
        if (!isTransitioning) return;

        const timer = window.setTimeout(
            () => setIsTransitioning(false),
            220
        );

        return () => window.clearTimeout(timer);
    }, [isTransitioning]);

    const pageCount = Math.ceil(sortedProducts.length / itemsPerPage);

    const visibleProducts = useMemo(() => {
        const startIndex = currentPage * itemsPerPage;

        return sortedProducts.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [currentPage, sortedProducts]);
    const groupedVisibleProducts = useMemo(() => {
        const groups = new Map<string, ProductResponse[]>();

        visibleProducts.forEach((product) => {
            const categoryName = product.category?.name?.trim() || "Другие";
            const current = groups.get(categoryName) ?? [];

            current.push(product);
            groups.set(categoryName, current);
        });

        return Array.from(groups.entries()).sort(([a], [b]) =>
            a.localeCompare(b, "ru")
        );
    }, [visibleProducts]);
    const clearFilters = () => {
        const params = new URLSearchParams();
        window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    };
    return {
        loading,
        groupedVisibleProducts,
        clearFilters,
        pageCount,
        setIsTransitioning,
        setCurrentPage,
        isTransitioning,
        currentPage,
        filters,
    }
}
