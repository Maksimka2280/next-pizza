import { axiosInstance } from "./instance";
import type { AddToCartDto, UpdateCartItemDto } from "../types/cart.dto";

export async function fetchCartApi() {
  const res = await axiosInstance.get("/cart");

  return res.data;
}

export async function addToCartApi(dto: AddToCartDto) {
  const res = await axiosInstance.post("/cart", dto);

  return res.data;
}

export async function updateCartItemApi(dto: UpdateCartItemDto) {
  const res = await axiosInstance.patch("/cart/item", dto);
  return res.data;
}

export async function deleteCartItemApi(cartItemId: number) {
  const res = await axiosInstance.delete("/cart/item", { data: { cartItemId } });
  return res.data;
}

export async function cleanCartApi() {
  const res = await axiosInstance.delete("/cart");

  return res.data;
}

export async function mergeCartApi() {
  const res = await axiosInstance.post("/cart/merge", {});
  return res.data;
}
