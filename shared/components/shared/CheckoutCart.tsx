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
  updateItem?: (dto: UpdateCartItemDto) => Promise<any> | void;
};

export function CheckoutCart({ cart, clearCart, removeItem, updateItem }: Props) {
  const fallback = useCart();
  const effectiveCart = cart ?? fallback.cart;
  const effectiveClear = clearCart ?? fallback.clearCart;
  const effectiveRemove = removeItem ?? fallback.removeItem;
  const effectiveUpdate = updateItem ?? fallback.updateItem;
  return (
    <>
      <div className="h-[340px] w-full max-w-[750px] rounded-[30px] bg-white px-[30px] py-[30px]">
        <div className="flex w-full items-center justify-between ">
          <Title text="1. Корзина" className="font-bold" size="md" />

          <button
            className="flex items-center justify-center gap-[10px] text-[#A1A1A1]"
            onClick={() => {
              void effectiveClear?.();
            }}
          >
            <Trash color="#A1A1A1" />
            Очистить корзину
          </button>
        </div>

        <div className="h-[230px] overflow-y-auto ">
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