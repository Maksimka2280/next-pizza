'use client'
import { Trash } from "lucide-react"
import { Title } from "./Title"
import { useCart } from "../../hooks/useCart"
import { CheckoutCard } from "../CheckOutComponents/CheckoutCard"

export const CheckoutCart = () => {
  const { cart, clearCart, removeItem, updateItem } = useCart();

  return (
    <>
      <div className="h-[340px] w-full max-w-[750px] rounded-[30px] bg-white px-[30px] py-[30px]">
        <div className="flex w-full items-center justify-between ">
          <Title text="1. Корзина" className="font-bold" size="md" />

          <button
            className="flex items-center justify-center gap-[10px] text-[#A1A1A1]"
            onClick={clearCart}
          >
            <Trash color="#A1A1A1" />
            Очистить корзину
          </button>
        </div>

        <div className="h-[230px] overflow-y-auto ">
          {cart?.items?.map((item) => (
            <CheckoutCard
              key={item.id}
              item={item}
              onRemove={removeItem}
              onQuantityChange={(cartItemId, quantity) => {
                void updateItem({ cartItemId, quantity });
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}