
"use client";

import { Button } from "../ui/button";
import React from "react";

interface Ingredient {
    id: number;
    name: string;
    price: number;
}

interface Product {
    id: number;
    name: string;
    imageUrl?: string | null;
}

interface ProductItem {
    id: number;
    price: number;
    product: Product;
}

export interface CartItemProps {
    id: number;
    quantity: number;
    productItem: ProductItem;
    ingredients?: Ingredient[];
    onChangeQuantity?: (id: number, quantity: number) => void;
    onRemove?: (id: number) => void;
};

export const CartProductCardInner: React.FC<CartItemProps> = ({
    id,
    quantity,
    productItem,
    ingredients = [],
    onChangeQuantity,
    onRemove,
}) => {
    const ingredientTotal = ingredients.reduce((s, i) => s + (i?.price || 0), 0);
    const unitPrice = (productItem?.price || 0) + ingredientTotal;
    const totalPrice = unitPrice * (quantity || 1);

    return (
        <main className="flex h-[140px] w-[395px] items-center gap-6 bg-white p-5">
            <div className="flex h-[65px] w-[65px] shrink-0 items-center justify-center">
                <img
                    src={productItem?.product?.imageUrl || '/img/header/icon-login-header.svg'}
                    alt={productItem?.product?.name || 'product'}
                    className="h-full w-full object-contain"
                />
            </div>

            <div className="flex-1">
                <div className="mb-3">
                    <h3 className="text-[16px] font-bold">{productItem?.product?.name}</h3>
                    <p className="text-[14px] text-[#818181]">{`${ingredients.length} ингредиентов`}</p>
                </div>

                <div className="h-px w-full bg-[#EDEDED]" />

                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0 text-[#FF6900]"
                            onClick={() => onChangeQuantity?.(id, Math.max(1, (quantity || 1) - 1))}
                        >
                            -
                        </Button>

                        <span className="w-5 text-center text-sm">{quantity}</span>

                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0 text-[#FF6900]"
                            onClick={() => onChangeQuantity?.(id, (quantity || 0) + 1)}
                        >
                            +
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[16px] font-bold">{totalPrice} ₽</span>
                        <Button variant="ghost" className="text-sm" onClick={() => onRemove?.(id)}>
                            Удалить
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );


}

export const CartProductCard = React.memo(CartProductCardInner) as React.FC<CartItemProps>;