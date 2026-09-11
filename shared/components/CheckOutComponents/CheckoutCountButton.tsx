"use client";

import { Button } from "../ui/button";

type CheckoutCountButtonProps = {
  quantity?: number;
  onChange?: (nextQuantity: number) => void;
};

export default function CheckoutCountButton({
  quantity = 0,
  onChange,
}: CheckoutCountButtonProps) {
  const handleQuantityChange = (delta: number) => {
    const nextQty = quantity + delta;
    if (nextQty < 1) return;

    onChange?.(nextQty);
  };

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
