"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getOrCreateGuestCartToken } from "../lib/guestCart";
import type { AddToCartDto, UpdateCartItemDto, CartDto, MergeCartDto } from "../types/cart.dto";
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
  const tokenRef = useRef<string | null>(null);
  const inFlightRef = useRef(false);
  const { data: session, status } = useSession();
  const isAuthenticated = Boolean(session?.user?.id);
  const fetchCart = useCallback(async (token?: string) => {
    if (status === 'loading') return null;

    const guestToken = isAuthenticated
      ? undefined
      : token ?? tokenRef.current ?? getOrCreateGuestCartToken();

    if (!isAuthenticated && !guestToken) {
      setCart(null);
      setLoading(false);
      return null;
    }

    if (guestToken) {
      tokenRef.current = guestToken;
    }

    if (inFlightRef.current) return null;

    inFlightRef.current = true;
    setLoading(true);

    try {
      const json = await fetchCartApi(guestToken || undefined);
      const nextCart = json.cart ?? null;

      setCart(nextCart);
      writeCachedCart(nextCart, session?.user?.id ?? null);

      return nextCart;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [session?.user?.id, status]);

  useEffect(() => {
    if (status === 'loading') return;

    const userId = session?.user?.id ?? null;
    const isAuthenticated = Boolean(userId);

    const syncCartFromEvent = (event: Event) => {
      const customEvent = event as CustomEvent<Maybe<CartDto>>;
      const nextCart = customEvent.detail ?? readCachedCart(userId);

      setCart(nextCart);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === getCartCacheKey(userId)) {
        setCart(readCachedCart(userId));
      }
    };

    const guestToken = isAuthenticated
      ? undefined
      : getOrCreateGuestCartToken();

    if (guestToken) {
      tokenRef.current = guestToken;
    } else if (isAuthenticated) {
      tokenRef.current = null;
    }

    setCart(readCachedCart(userId));

    window.addEventListener(
      CART_UPDATED_EVENT,
      syncCartFromEvent as EventListener,
    );
    window.addEventListener('storage', handleStorage);

    void fetchCart(guestToken || undefined);

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

    const isAuthenticated = Boolean(session?.user?.id);

    const token = isAuthenticated
      ? undefined
      : dto.token ?? tokenRef.current ?? getOrCreateGuestCartToken();

    if (!isAuthenticated && !token) return null;

    try {
      const payload: AddToCartDto = isAuthenticated
        ? {
          productItemId: dto.productItemId,
          quantity: dto.quantity,
          ingredients: dto.ingredients,
        }
        : { ...dto, token: token ?? undefined };

      const json = await addToCartApi(payload);
      const cartItem = json.cartItem;

      if (json.cart) {
        setCart(json.cart as CartDto);
        writeCachedCart(json.cart as CartDto);
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
      writeCachedCart(next);

      return cartItem;

    } catch (e) {
      console.error(e);
      return null;
    }
  }, [cart, session, status]);

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

      queueMicrotask(() => writeCachedCart(next));
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
        queueMicrotask(() => writeCachedCart(next));
        return next;
      });

      return updated;
    } catch (e) {
      console.error(e);
      const token = tokenRef.current ?? getOrCreateGuestCartToken();
      if (token) {
        await fetchCart(token);
      }
      return null;
    }
  }, [fetchCart]);

  const addOrIncrement = useCallback(async (dto: AddToCartDto) => {
    const token = dto.token ?? tokenRef.current ?? getOrCreateGuestCartToken();
    if (!token) return null;

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
        queueMicrotask(() => writeCachedCart(next));
        return next;
      });

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  const mergeCart = useCallback(async (dto: MergeCartDto) => {
    try {
      await mergeCartApi(dto);
      await fetchCart();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [fetchCart]);
  const clearCart = useCallback(async () => {
    const token = isAuthenticated
      ? undefined
      : tokenRef.current ?? getOrCreateGuestCartToken() ?? undefined;

    if (!isAuthenticated && !token) return false;

    try {
      const result = await cleanCartApi(token);

      setCart(null);
      writeCachedCart(null);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [isAuthenticated]);
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
