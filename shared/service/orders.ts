import { axiosInstance } from "./instance";
import type { CreateOrderDto, OrderDto, OrderHistoryDto } from "../types/cart.dto";
import { ApiRoutes } from "./constants";

export async function createOrder(dto: CreateOrderDto): Promise<OrderDto> {
  const { data } = await axiosInstance.post<OrderDto>(ApiRoutes.ORDERS, dto);
  return data;
}

export async function getOrders(token?: string): Promise<OrderHistoryDto[]> {
  const { data } = await axiosInstance.get<OrderHistoryDto[]>(ApiRoutes.ORDERS, {
    params: token ? { token } : undefined,
  });

  return data;
}