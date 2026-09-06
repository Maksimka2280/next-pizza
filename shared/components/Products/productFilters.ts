export type ProductResponse = {
  id?: number;
  name?: string;
  imageUrl?: string;
  items?: Array<{ id?: number; price?: number }>;
  ingredients?: Array<{ id?: number; name?: string }>;
  category?: {
    id?: number;
    name?: string;
  };
};

export type ProductFiltersState = {
  minPrice?: number;
  maxPrice?: number;
  hasMinPrice: boolean;
  hasMaxPrice: boolean;
  hasIngredientFilter: boolean;
  hasCategoryFilter: boolean;
  hasFilters: boolean;
  selectedIngredientIds: Set<string>;
  categoryQuery: string;
  ingredientQuery: string;
};

export function parseProductFilters(searchParams: URLSearchParams): ProductFiltersState {
  const minPriceQuery = searchParams.get("priceFrom")?.trim() ?? "";
  const maxPriceQuery = searchParams.get("priceTo")?.trim() ?? "";
  const ingredientQuery = searchParams.get("ingredients")?.trim() ?? "";
  const categoryQuery = searchParams.get("category")?.trim() ?? "";

  const hasMinPrice = minPriceQuery !== "";
  const hasMaxPrice = maxPriceQuery !== "";
  const hasIngredientFilter = ingredientQuery !== "";
  const hasCategoryFilter = categoryQuery !== "";

  const minPrice = hasMinPrice ? Number(minPriceQuery) : undefined;
  const maxPrice = hasMaxPrice ? Number(maxPriceQuery) : undefined;
  const selectedIngredientIds = new Set(
    ingredientQuery
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );

  return {
    minPrice,
    maxPrice,
    hasMinPrice,
    hasMaxPrice,
    hasIngredientFilter,
    hasCategoryFilter,
    hasFilters: hasMinPrice || hasMaxPrice || hasIngredientFilter || hasCategoryFilter,
    selectedIngredientIds,
    categoryQuery,
    ingredientQuery,
  };
}

export function filterProducts(products: ProductResponse[], filters: ProductFiltersState) {
  if (!filters.hasFilters) {
    return products;
  }

  return products.filter((product) => {
    const price = product.items?.[0]?.price ?? 0;

    if (filters.minPrice !== undefined && !Number.isNaN(filters.minPrice) && price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice !== undefined && !Number.isNaN(filters.maxPrice) && price > filters.maxPrice) {
      return false;
    }

    if (filters.hasIngredientFilter) {
      const ingredientIds = product.ingredients?.map((ingredient) => String(ingredient.id)) ?? [];
      if (!ingredientIds.some((id) => filters.selectedIngredientIds.has(id))) {
        return false;
      }
    }

    if (filters.hasCategoryFilter) {
      const productCategory = product.category?.name?.trim() ?? "";
      if (productCategory.toLowerCase() !== filters.categoryQuery.toLowerCase()) {
        return false;
      }
    }

    return true;
  });
}
