import axios from "axios";
import type { PizzaSize, PizzaType } from "../constants/Pizza";
import { ApiRoutes } from "../service/constants";
import { axiosInstance } from "../service/instance";

export type AdminProductIngredient = { id: number; name: string; price: number };
export type CreatedProduct = { id: number; name: string };
export type AdminProductVariant = {
  price: number;
  size: PizzaSize | null;
  pizzaType: PizzaType | null;
};

type CreateAdminProductDto = {
  name: string;
  imageUrl: string;
  categoryName: string;
  variants: AdminProductVariant[];
  ingredientIds: number[];
};

export async function fetchAdminProductOptions() {
  const [categoryResponse, ingredientResponse] = await Promise.all([
    axiosInstance.get<string[]>(ApiRoutes.CATEGORIES),
    axiosInstance.get<AdminProductIngredient[]>(ApiRoutes.INGREDIENTS),
  ]);
  return {
    categories: categoryResponse.data,
    ingredients: ingredientResponse.data,
  };
}

export async function createAdminProduct(product: CreateAdminProductDto) {
  const { data } = await axiosInstance.post<CreatedProduct>(ApiRoutes.PRODUCTS, product);
  return data;
}

export function getAdminProductErrorMessage(error: unknown, fallback: string) {
  const message = axios.isAxiosError<{ error?: string }>(error)
    ? error.response?.data?.error
    : undefined;

  if (message === "Forbidden") {
    return "Для создания товара необходимы права администратора.";
  }
  return message || fallback;
}
