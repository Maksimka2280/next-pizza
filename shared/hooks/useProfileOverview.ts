import { useEffect, useState } from "react";
import { getAll } from "../service/favorites";
import { getOrders } from "../service/orders";
import type { OrderDto } from "../types/cart.dto";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export function useProfileOverview(
  userId: string | undefined,
  sessionStatus: SessionStatus,
) {
  const [result, setResult] = useState<{
    userId: string;
    orderCount: number;
    favoriteCount: number;
    recentOrder: OrderDto | undefined;
    error: string | null;
  }>();

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus !== "authenticated" || !userId) return;

    let isCurrent = true;

    void Promise.all([getOrders(), getAll()])
      .then(([orders, favorites]) => {
        if (!isCurrent) return;
        setResult({
          userId,
          orderCount: orders.length,
          favoriteCount: favorites.length,
          recentOrder: orders[0],
          error: null,
        });
      })
      .catch((loadError: unknown) => {
        console.error("Не удалось загрузить сводку профиля:", loadError);
        if (isCurrent) {
          setResult({
            userId,
            orderCount: 0,
            favoriteCount: 0,
            recentOrder: undefined,
            error: "Не удалось загрузить данные профиля. Попробуйте позже.",
          });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [sessionStatus, userId]);

  const currentResult =
    sessionStatus === "authenticated" && result?.userId === userId
      ? result
      : undefined;

  return {
    orderCount: currentResult?.orderCount ?? null,
    favoriteCount: currentResult?.favoriteCount ?? null,
    recentOrder: currentResult?.recentOrder,
    isLoading: sessionStatus === "loading" || (!!userId && !currentResult),
    error: currentResult?.error ?? null,
  };
}
