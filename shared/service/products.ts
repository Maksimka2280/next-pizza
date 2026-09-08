import { Product } from "@prisma/client";
import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";

export type ProductWithRelations = {
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

export const getAll = async (): Promise<ProductWithRelations[]> => {
  const { data } = await axiosInstance.get<ProductWithRelations[]>(ApiRoutes.PRODUCTS);
  return data;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const { data } = await axiosInstance.get<{ products: Product[] }>(ApiRoutes.SEARCH_PRODUCTS, {
    params: { query },
  });

  return data.products ?? [];
};

export const search = async (query: string): Promise<Product[]> => {
  return searchProducts(query);
};