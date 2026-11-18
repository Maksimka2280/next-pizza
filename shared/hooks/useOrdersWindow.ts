import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getOrders } from "../service/orders";
import type { OrderHistoryDto } from "../types/cart.dto";

export function useOrdersWindow(token?: string) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const requestKey = `${token ?? ""}:${userId ?? ""}:${status}`;
  const [result, setResult] = useState<{
    key: string;
    orders: OrderHistoryDto[];
    expandedOrders: Set<number>;
    error: string | null;
  }>();

  useEffect(() => {
    if (status === "loading") return;
    let isCurrent = true;

    void getOrders(token)
      .then((customerOrders) => {
        if (!isCurrent) return;
        setResult({
          key: requestKey,
          orders: customerOrders,
          expandedOrders: new Set(customerOrders.map(({ id }) => id)),
          error: null,
        });
      })
      .catch((loadError: unknown) => {
        console.error("Не удалось загрузить заказы:", loadError);
        if (isCurrent) {
          setResult({
            key: requestKey,
            orders: [],
            expandedOrders: new Set(),
            error: "Не удалось загрузить заказы. Попробуйте обновить страницу.",
          });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [requestKey, status, token]);

  const currentResult = result?.key === requestKey ? result : undefined;

  const toggleOrder = (orderId: number) => {
    setResult((current) => {
      if (!current || current.key !== requestKey) return current;
      const next = new Set(current.expandedOrders);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return { ...current, expandedOrders: next };
    });
  };

  return {
    orders: currentResult?.orders ?? [],
    expandedOrders: currentResult?.expandedOrders ?? new Set<number>(),
    isLoading: status === "loading" || !currentResult,
    error: currentResult?.error ?? null,
    toggleOrder,
  };
}
