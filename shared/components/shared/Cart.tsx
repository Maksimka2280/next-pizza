"use client";

import { useCallback } from "react";
import Image from "next/image";
import { ArrowLeft, MoveRight, X } from "lucide-react";
import { Button } from "../ui/button";
import { useCart } from "../../hooks/useCart";
import { CartProductCard } from "./CartProductCard";

interface Props {
  onClose: () => void;
}

export const Cart = ({ onClose }: Props) => {
  const { cart, total, loading, updateItem, removeItem } = useCart();

  const handleChangeQuantity = useCallback((cartItemId: number, quantity: number) => {
    updateItem({ cartItemId, quantity });
  }, [updateItem]);

  const handleRemove = useCallback((cartItemId: number) => {
    removeItem(cartItemId);
  }, [removeItem]);

  const totalSum = cart?.items.reduce((s, it) => {
    const ingredientsTotal = (it.ingredients || []).reduce((a, b) => a + (b?.price || 0), 0);
    return s + ((it.productItem?.price || 0) + ingredientsTotal) * (it.quantity || 1);
  }, 0) ?? 0;

  if (loading) {
    return (
      <main className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        <div className="absolute right-0 top-0 h-full w-[400px] bg-[#F4F1EE] flex flex-col">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="h-6 w-36 animate-pulse rounded-full bg-[#E7E0DA]" />
            <div className="h-8 w-8 animate-pulse rounded-full bg-[#E7E0DA]" />
          </div>

          <div className="flex flex-1 flex-col gap-3 px-5 py-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-[18px] bg-white p-3 shadow-sm">
                <div className="flex gap-3">
                  <div className="h-[80px] w-[80px] rounded-[16px] bg-[#E7E0DA]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded-full bg-[#E7E0DA]" />
                    <div className="h-3 w-full rounded-full bg-[#E7E0DA]" />
                    <div className="h-3 w-3/4 rounded-full bg-[#E7E0DA]" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[210px] w-full bg-white px-5 pt-10">
            <div className="space-y-5">
              <div className="h-5 w-full animate-pulse rounded-full bg-[#F0EAE5]" />
              <div className="h-5 w-full animate-pulse rounded-full bg-[#F0EAE5]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-[400px] bg-[#F4F1EE] flex flex-col">
        {cart?.items?.length ? (
          <>
            <div className="flex items-center justify-between px-5 py-4 ">
              <h1 className="text-[20px] ">
                В Корзине <span className="font-bold">{cart?.items.length ?? 0}</span> товара
              </h1>
              <button onClick={onClose}>
                <X />
              </button>
            </div>

            <div className="flex flex-col gap-2.5  overflow-y-auto">
              {cart.items.map((it) => (
                <CartProductCard
                  key={it.id}
                  id={it.id}
                  quantity={it.quantity}
                  productItem={it.productItem}
                  ingredients={it.ingredients}
                  onChangeQuantity={handleChangeQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <div className="bg-white w-full h-[210px] mt-auto px-5 pt-10">
              <div className="w-full ">
                <div className="flex items-end ">
                  <span className="text-[16px]">Итого:</span>
                  <div className="mx-2 flex-1 mb-[6px] border-t-2 border-dotted border-[#D9D9D9]" />
                  <span className="text-[18px] font-bold">{total} ₽</span>
                </div>
                <div className="mt-5 flex items-end">
                  <span className="text-[16px]">Налог 5%:</span>
                  <div className="mx-2 flex-1 mb-[6px] border-t-2 border-dotted border-[#D9D9D9]" />
                  <span className="text-[18px] font-bold">{Math.round(totalSum * 0.05)} ₽</span>
                </div>
              </div>
              <div className="flex justify-center items-center mt-[21px] ">
                <Button className={'w-full h-[55px] text-[16px] rounded-[18px]'}>Оформить заказ <MoveRight /></Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 px-5">
            <Image src="/img/header/empty-box.svg" alt="Пустая корзина" width={120} height={120} />
            <h1 className="text-[22px] ">Корзина пустая</h1>
            <p className="text-[#818181] text-center">Добавьте хотя бы одну пиццу, чтобы совершить заказ</p>
            <Button onClick={onClose} className='h-[55px] rounded-[18px] w-[230px] text-[16px]'><ArrowLeft /> Вернуться назад</Button>
          </div>
        )}
      </div>
    </main>
  );
};