import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";

export const getAll = async (): Promise<string[]> => {
  const { data } = await axiosInstance.get<string[]>(ApiRoutes.CATEGORIES);
  return data;
};
