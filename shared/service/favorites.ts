import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";

export type FavoriteProduct = {
  id: number;
  name: string;
  imageUrl: string;
  items: { id: number; price: number }[];
  category: { name: string };
  ingredients: { name: string }[];
};

export const getAll = async (): Promise<FavoriteProduct[]> => {
  const { data } = await axiosInstance.get<{ favorites: FavoriteProduct[] }>(ApiRoutes.FAVORITES);
  return data.favorites;
};

export const add = async (productId: number): Promise<void> => {
  await axiosInstance.post(ApiRoutes.FAVORITES, { productId });
};

export const remove = async (productId: number): Promise<void> => {
  await axiosInstance.delete(ApiRoutes.FAVORITES, { params: { productId } });
};