import { X } from "lucide-react";
import type { CartItemDto } from "../../types/cart.dto";
import { Button } from "../ui/button";
import CheckoutCountButton from "./CheckoutCountButton";
import { CheckoutImg } from "./CheckoutImg";
import { CheckoutInfo } from "./CheckoutInfo";
import { CheckoutPrice } from "./CheckoutPrice";

type CheckoutCardProps = {
  item: CartItemDto;
  readOnly?: boolean;
  onRemove?: (cartItemId: number) => void;
  onQuantityChange?: (cartItemId: number, quantity: number) => void;
};

export const CheckoutCard = ({
  item,
  readOnly = false,
  onRemove,
  onQuantityChange,
}: CheckoutCardProps) => {
  const handleQuantityChange = (nextQuantity: number) => {
    onQuantityChange?.(item.id, nextQuantity);
  };
  const unitPrice =
    item.productItem.price +
    item.ingredients.reduce((total, ingredient) => total + ingredient.price, 0);

  return (
    <>
      <div className="my-[25px] h-[1px] w-full bg-[#EDEDED]" />
      <div className="flex w-full flex-wrap items-center gap-3 sm:flex-nowrap sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5">
          <CheckoutImg src={item.productItem.product.imageUrl ?? ""} />
          <CheckoutInfo
            description={
              item.ingredients.map((ingredient) => ingredient.name).join(", ") ||
              "Без добавок"
            }
            title={item.productItem.product.name}
          />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0 sm:gap-4">
          <CheckoutPrice value={unitPrice} />
          {readOnly ? (
            <span className="min-w-[48px] text-center text-sm text-[#777777]">
              {item.quantity} шт.
            </span>
          ) : (
            <div className="flex items-center gap-[10px]">
              <CheckoutCountButton
                quantity={item.quantity}
                onChange={handleQuantityChange}
              />
              <Button
                type="button"
                variant="ghost"
                className="text-sm"
                onClick={() => onRemove?.(item.id)}
              >
                <X color="#A1A1A1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
