import axios from "axios";
import type { CreateOrderDto, OrderDto } from "../types/cart.dto";
import { ApiRoutes } from "./constants";

const BASE = process.env.NEXT_PUBLIC_API_URL ;

export async function createOrder(dto: CreateOrderDto): Promise<OrderDto> {
  const { data } = await axios.post<OrderDto>(`${BASE}${ApiRoutes.ORDERS}`, dto);
  return data;
}

export async function getOrders(token: string): Promise<OrderDto[]> {
  const {data} = await axios.get<OrderDto[]>(
    `${BASE}${ApiRoutes.ORDERS}?token=${encodeURIComponent(token)}`,
  );
  return data;
}