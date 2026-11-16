"use client";

import { Clock3, PackageOpen } from "lucide-react";
import { useOrdersWindow } from "../../hooks/useOrdersWindow";
import { OrderCard } from "./OrderCard";
import { Skeleton } from "../ui/skeleton";

export function OrdersWindow({ token }: { token?: string }) {
  const { orders, expandedOrders, isLoading, error, toggleOrder } =
    useOrdersWindow(token);

  if (isLoading) {
    return (
      <div className="mt-6 space-y-4" aria-label="Загружаем заказы">
        {[0, 1].map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-[#F0ECE8] bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-36 rounded-lg bg-[#F2EEE9]" />
                <Skeleton className="h-4 w-48 rounded-lg bg-[#F2EEE9]" />
              </div>
              <Skeleton className="h-8 w-28 rounded-full bg-[#F2EEE9]" />
            </div>
            <div className="mt-6 flex items-center gap-4">
              <Skeleton className="size-16 rounded-xl bg-[#F2EEE9]" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-2/3 rounded-lg bg-[#F2EEE9]" />
                <Skeleton className="h-4 w-1/2 rounded-lg bg-[#F2EEE9]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p role="alert" className="mt-6 rounded-2xl bg-white p-6 text-red-700 shadow-sm">
        {error}
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-[#FED7AA] bg-white px-6 py-12 text-center shadow-sm">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-[#FFF0E7] text-[#FE5F00]">
          <PackageOpen size={26} aria-hidden="true" />
        </span>
        <p className="mt-4 text-lg font-semibold text-[#292929]">
          Заказов пока нет
        </p>
        <p className="mt-2 text-sm text-[#707070]">
          Как только вы оформите заказ, он появится здесь.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <p className="flex items-center gap-2 text-sm text-[#777]">
        <Clock3 size={16} aria-hidden="true" />
        Заказов: <span className="font-semibold text-[#292929]">{orders.length}</span>
      </p>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          isExpanded={expandedOrders.has(order.id)}
          onToggle={toggleOrder}
        />
      ))}
    </div>
  );
}
