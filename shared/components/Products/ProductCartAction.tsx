"use client";

import { toast } from "react-hot-toast";
import { useCart } from "../../hooks/useCart";
import { Button } from "../ui/button";

type ProductCartActionProps = {
  productId?: number;
  productItemId?: number;
};

export default function ProductCartAction({
  productId,
  productItemId,
}: ProductCartActionProps) {
  const { cart, addOrIncrement, updateItem } = useCart();

  const cartItem = cart?.items?.find(
    (item) => item.productItem?.product?.id === productId
  );

  const quantity = cartItem?.quantity ?? 0;
  const handleQuantityChange = (delta: number) => {
    if (!cartItem || cartItem.id === undefined) return;

    const nextQty = (cartItem.quantity || 0) + delta;
    if (nextQty < 1) return;

    void updateItem({ cartItemId: cartItem.id, quantity: nextQty });
  };

  if (!cartItem) {
    return (
      <button
        className="h-[40px] w-[125px] rounded-[15px] bg-[#FFFAF4] text-[15px] font-bold text-[#FE5F00]"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!productItemId) return;

          void toast.promise(
            addOrIncrement({
              productItemId,
              quantity: 1,
            }),
            {
              loading: "Добавление...",
              success: "Заказ успешно добавлен в корзину",
              error: "Не удалось добавить товар в корзину",
            }
          );
        }}
      >
        + добавить
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="h-8 w-8 p-0 text-[#FF6900]"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleQuantityChange(-1);
        }}
      >
        -
      </Button>

      <span className="w-5 text-center text-sm">{quantity}</span>

      <Button
        variant="outline"
        className="h-8 w-8 p-0 text-[#FF6900]"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleQuantityChange(1);
        }}
      >
        +
      </Button>
    </div>
  );
}
