import axios from 'axios';
import type { AddToCartDto, UpdateCartItemDto, MergeCartDto } from "../types/cart.dto";

const BASE = process.env.NEXT_PUBLIC_API_URL ;

export async function fetchCartApi(token: string) {
  const res = await axios.get(`${BASE}/cart`, { params: { token } });
  return res.data;
}

export async function addToCartApi(dto: AddToCartDto) {
  const res = await axios.post(`${BASE}/cart`, dto);
  return res.data;
}

export async function updateCartItemApi(dto: UpdateCartItemDto) {
  const res = await axios.patch(`${BASE}/cart/item`, dto);
  return res.data;
}

export async function deleteCartItemApi(cartItemId: number) {
  const res = await axios.delete(`${BASE}/cart/item`, { data: { cartItemId } });
  return res.data;
}

export async function mergeCartApi(dto: MergeCartDto) {
  const res = await axios.post(`${BASE}/cart/merge`, dto);
  return res.data;
}
