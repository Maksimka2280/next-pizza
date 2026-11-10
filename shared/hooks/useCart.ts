"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AddToCartDto, UpdateCartItemDto, CartDto } from "../types/cart.dto";
import { fetchCartApi, addToCartApi, updateCartItemApi, deleteCartItemApi, mergeCartApi, cleanCartApi } from "../service/cart.client";
import { useSession } from 'next-auth/react';
type Maybe<T> = T | null;
const CART_CACHE_KEY = "guest_cart_cache";
const getCartCacheKey = (userId?: string | null) =>
  userId ? `cart_cache_user_${userId}` : CART_CACHE_KEY;
const CART_UPDATED_EVENT = "next-pizza-cart-updated";

function notifyCartUpdate(cart: Maybe<CartDto>) {
  if (typeof window === "undefined") return;

  try {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: cart }));
  } catch {
    // no-op
  }
}

function readCachedCart(userId?: string | null): Maybe<CartDto> {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(getCartCacheKey(userId));
    if (!cached) return null;
    const parsed = JSON.parse(cached) as CartDto | null;
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCachedCart(cart: Maybe<CartDto>, userId?: string | null) {
  if (typeof window === "undefined") return;

  try {
    if (!cart) {
      localStorage.removeItem(getCartCacheKey(userId));
    } else {
      localStorage.setItem(getCartCacheKey(userId), JSON.stringify(cart));
    }
    notifyCartUpdate(cart);
  } catch {
    // no-op
  }
}

export function useCart() {
  const [cart, setCart] = useState<Maybe<CartDto>>(readCachedCart);
  const [loading, setLoading] = useState(true);
  const inFlightRef = useRef(false);
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? null;
  const fetchCart = useCallback(async () => {
    if (status === 'loading') return null;

    if (inFlightRef.current) return null;

    inFlightRef.current = true;
    setLoading(true);

    try {
      const json = await fetchCartApi();
      const nextCart = json.cart ?? null;

      setCart(nextCart);
      writeCachedCart(nextCart, userId);

      return nextCart;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [status, userId]);

  useEffect(() => {
    if (status === 'loading') return;

    const currentUserId = session?.user?.id ?? null;

    const syncCartFromEvent = (event: Event) => {
      const customEvent = event as CustomEvent<Maybe<CartDto>>;
      const nextCart = customEvent.detail ?? readCachedCart(currentUserId);

      setCart(nextCart);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === getCartCacheKey(currentUserId)) {
        setCart(readCachedCart(currentUserId));
      }
    };

    setCart(readCachedCart(currentUserId));

    window.addEventListener(
      CART_UPDATED_EVENT,
      syncCartFromEvent as EventListener,
    );
    window.addEventListener('storage', handleStorage);

    void fetchCart();

    return () => {
      window.removeEventListener(
        CART_UPDATED_EVENT,
        syncCartFromEvent as EventListener,
      );
      window.removeEventListener('storage', handleStorage);
    };
  }, [fetchCart, session?.user?.id, status]);

  const addToCart = useCallback(async (dto: AddToCartDto) => {
    if (status === 'loading') return null;

    try {
      const json = await addToCartApi(dto);
      const cartItem = json.cartItem;

      if (json.cart) {
        setCart(json.cart as CartDto);
        writeCachedCart(json.cart as CartDto, userId);
        return cartItem;
      }

      const next = cart
        ? ({
          ...cart,
          items: [...cart.items, cartItem],
        } as CartDto)
        : ({
          items: [cartItem],
        } as CartDto);

      setCart(next);
      writeCachedCart(next, userId);

      return cartItem;

    } catch (e) {
      console.error(e);
      return null;
    }
  }, [cart, status, userId]);

  const updateItem = useCallback(async (dto: UpdateCartItemDto) => {
    const safeQuantity = Math.max(1, dto.quantity || 1);

    setCart((prev) => {
      if (!prev) return prev;

      const next = {
        ...prev,
        items: prev.items.map((it) =>
          it.id === dto.cartItemId ? { ...it, quantity: safeQuantity } : it
        ),
      } as CartDto;

      queueMicrotask(() => writeCachedCart(next, userId));
      return next;
    });

    try {
      const json = await updateCartItemApi({ ...dto, quantity: safeQuantity });
      const updated = json.updated;

      setCart((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          items: prev.items.map((it) =>
            it.id === updated.id ? { ...it, quantity: updated.quantity } : it
          ),
        } as CartDto;
        queueMicrotask(() => writeCachedCart(next, userId));
        return next;
      });

      return updated;
    } catch (e) {
      console.error(e);
      await fetchCart();
      return null;
    }
  }, [fetchCart, userId]);

  const addOrIncrement = useCallback(async (dto: AddToCartDto) => {
    const existing = cart?.items?.find((it) => {
      const pid = it.productItem?.id;
      if (pid !== dto.productItemId) return false;
      const existingIds = new Set((it.ingredients || []).map((ing) => ing.id));
      const dtoIds = new Set(dto.ingredients || []);
      if (existingIds.size !== dtoIds.size) return false;
      for (const id of dtoIds) if (!existingIds.has(id)) return false;
      return true;
    });

    if (existing) {
      const newQty = (existing.quantity || 0) + (dto.quantity || 1);
      return await updateItem({ cartItemId: existing.id, quantity: newQty });
    }

    return await addToCart(dto);
  }, [cart, addToCart, updateItem]);

  const removeItem = useCallback(async (cartItemId: number) => {
    try {
      await deleteCartItemApi(cartItemId);
      setCart((prev) => {
        if (!prev) return prev;
        const next = { ...prev, items: prev.items.filter((it) => it.id !== cartItemId) } as CartDto;
        queueMicrotask(() => writeCachedCart(next, userId));
        return next;
      });

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [userId]);

  const mergeCart = useCallback(async () => {
    try {
      await mergeCartApi();
      await fetchCart();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [fetchCart]);
  const clearCart = useCallback(async () => {
    try {
      await cleanCartApi();

      setCart(null);
      writeCachedCart(null, userId);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [userId]);
  const total = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((s, it) => {
      const ingredientsTotal = (it.ingredients || []).reduce((a, b) => a + (b?.price || 0), 0);
      return s + ((it.productItem?.price || 0) + ingredientsTotal) * (it.quantity || 1);
    }, 0);
  }, [cart]);

  return {
    cart,
    loading,
    total,
    fetchCart,
    addToCart,
    addOrIncrement,
    updateItem,
    removeItem,
    mergeCart,
    clearCart
  } as const;
}
