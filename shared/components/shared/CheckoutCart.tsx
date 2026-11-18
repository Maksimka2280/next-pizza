'use client'
import { Trash } from "lucide-react"
import { Title } from "./Title"
import { useCart } from "../../hooks/useCart"
import { CheckoutCard } from "../CheckOutComponents/CheckoutCard"
import type { CartDto, UpdateCartItemDto } from "../../types/cart.dto"

type Props = {
  cart?: CartDto | null;
  clearCart?: () => Promise<boolean> | void;
  removeItem?: (cartItemId: number) => Promise<boolean> | void;
  updateItem?: (dto: UpdateCartItemDto) => Promise<unknown> | void;
};

export function CheckoutCart({ cart, clearCart, removeItem, updateItem }: Props) {
  const fallback = useCart();
  const effectiveCart = cart ?? fallback.cart;
  const effectiveClear = clearCart ?? fallback.clearCart;
  const effectiveRemove = removeItem ?? fallback.removeItem;
  const effectiveUpdate = updateItem ?? fallback.updateItem;
  return (
    <>
      <div className="h-auto w-full min-w-0 rounded-2xl bg-white p-4 sm:rounded-[30px] sm:p-6 lg:max-w-[750px] lg:p-[30px]">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <Title text="1. Корзина" className="font-bold" size="md" />

          <button
            className="flex items-center justify-center gap-2 text-sm text-[#A1A1A1] sm:text-base"
            onClick={() => {
              void effectiveClear?.();
            }}
          >
            <Trash color="#A1A1A1" />
            Очистить корзину
          </button>
        </div>

        <div className="max-h-[360px] overflow-y-auto sm:max-h-[420px]">
          {effectiveCart?.items?.map((item) => (
            <CheckoutCard
              key={item.id}
              item={item}
              onRemove={(id) => {
                void effectiveRemove?.(id);
              }}
              onQuantityChange={(cartItemId, quantity) => {
                void effectiveUpdate?.({ cartItemId, quantity });
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}