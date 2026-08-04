import { Ingredient } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const parseNumber = (value: string | null) => {
  if (value === null || value === "") return "";
  const parsed = Number(value);
  return Number.isNaN(parsed) ? "" : parsed;
};

const parseBoolean = (value: string | null) => value === "1" || value === "true";

const parseIngredientIds = (value: string | null) => {
  if (!value) return new Set<string>();
  return new Set(value.split(",").filter(Boolean));
};

export const useProductFilters = (ingredients: Ingredient[]) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [pendingMinPrice, setPendingMinPrice] = useState<number | "">("");
  const [pendingMaxPrice, setPendingMaxPrice] = useState<number | "">("");
  const [pendingIngredientIds, setPendingIngredientIds] = useState<Set<string>>(new Set());
  const [pendingCanBuild, setPendingCanBuild] = useState(false);
  const [pendingNew, setPendingNew] = useState(false);
  const [selected2, setSelected2] = useState("Традиционное");

  useEffect(() => {
    setPendingMinPrice(parseNumber(searchParams.get("priceFrom")));
    setPendingMaxPrice(parseNumber(searchParams.get("priceTo")));
    setPendingIngredientIds(parseIngredientIds(searchParams.get("ingredients")));
    setPendingCanBuild(parseBoolean(searchParams.get("canBuild")));
    setPendingNew(parseBoolean(searchParams.get("new")));

    const doughValue = searchParams.get("dough");
    setSelected2(doughValue === "Тонкое" ? "Тонкое" : "Традиционное");
  }, [searchParams]);

  const items = useMemo(
    () => ingredients.map((item) => ({ value: String(item.id), text: item.name })),
    [ingredients]
  );

  const toggleIngredient = (id: string) => {
    setPendingIngredientIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (pendingMinPrice !== "") {
      params.set("priceFrom", String(pendingMinPrice));
    }
    if (pendingMaxPrice !== "") {
      params.set("priceTo", String(pendingMaxPrice));
    }
    if (pendingIngredientIds.size > 0) {
      params.set("ingredients", Array.from(pendingIngredientIds).join(","));
    }
    if (pendingCanBuild) {
      params.set("canBuild", "1");
    }
    if (pendingNew) {
      params.set("new", "1");
    }
    if (selected2) {
      params.set("dough", selected2);
    }

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.push(url);
  };

  return {
    pendingMinPrice,
    setPendingMinPrice,
    pendingMaxPrice,
    setPendingMaxPrice,
    pendingIngredientIds,
    pendingCanBuild,
    setPendingCanBuild,
    pendingNew,
    setPendingNew,
    selected2,
    setSelected2,
    items,
    toggleIngredient,
    applyFilters,
  };
};
