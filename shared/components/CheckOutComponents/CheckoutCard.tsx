import { X } from "lucide-react";
import type { CartItemDto } from "../../types/cart.dto";
import { Button } from "../ui/button";
import CheckoutCountButton from "./CheckoutCountButton";
import { CheckoutImg } from "./CheckoutImg";
import { CheckoutInfo } from "./CheckoutInfo";
import { CheckoutPrice } from "./CheckoutPrice";

type CheckoutCardProps = {
  item: CartItemDto;
  onRemove?: (cartItemId: number) => void;
  onQuantityChange?: (cartItemId: number, quantity: number) => void;
};

export const CheckoutCard = ({
  item,
  onRemove,
  onQuantityChange,
}: CheckoutCardProps) => {
  const handleQuantityChange = (nextQuantity: number) => {
    onQuantityChange?.(item.id, nextQuantity);
  };

  return (
    <>
      <div className="my-[25px] h-[1px] w-full bg-[#EDEDED]" />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[20px]">
          <CheckoutImg src={item.productItem.product.imageUrl ?? ""} />

          <CheckoutInfo
            description={
              item.ingredients.map((ingredient) => ingredient.name).join(", ") ||
              "нету ингредиентов"
            }
            title={item.productItem.product.name}
          />
        </div>

        <CheckoutPrice value={item.productItem.price} />

        <div className="flex items-center gap-[10px]">
          <CheckoutCountButton
            quantity={item.quantity}
            onChange={handleQuantityChange}
          />
          <Button
            variant="ghost"
            className="text-sm"
            onClick={() => onRemove?.(item.id)}
          >
            <X color="#A1A1A1" />
          </Button>
        </div>
      </div>
    </>
  );
};
