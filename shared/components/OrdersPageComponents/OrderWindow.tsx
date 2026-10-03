'use client'

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { getOrders } from "../../service/orders";
import type { OrderDto } from "../../types/cart.dto";
import { getOrCreateGuestCartToken } from "../../lib/guestCart";
import { CheckoutCard } from "../CheckOutComponents/CheckoutCard";
import { Skeleton } from "../ui/skeleton";

const orderStatusLabels: Record<string, string> = {
    PENDING: "Ожидает оплаты",
    SUCCEEDED: "Оплачено",
    CANCELLED: "Отменено",
};

export function OrdersWindow() {
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadOrders = async () => {
            const token = getOrCreateGuestCartToken();
            if (!token) {
                setError("Не удалось получить данные заказов");
                setIsLoading(false);
                return;
            }

            try {
                const customerOrders = await getOrders(token);
                if (isMounted) {
                    setOrders(customerOrders);
                    setExpandedOrders(new Set(customerOrders.map((order) => order.id)));
                }
            } catch (loadError) {
                console.error("Не удалось загрузить заказы:", loadError);
                if (isMounted) {
                    setError("Не удалось загрузить заказы. Попробуйте обновить страницу.");
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        void loadOrders();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="max-w-[750px] space-y-5">
            {isLoading && (
                <>
                    {[0, 1].map((order) => (
                        <div key={order} className="rounded-[30px] bg-white p-[30px]">
                            <div className="flex items-center justify-between gap-5">
                                <div className="flex items-center gap-5">
                                    <Skeleton className="h-7 w-28 rounded-[10px] bg-[#F2EEE9]" />
                                    <Skeleton className="h-5 w-44 rounded-[10px] bg-[#F2EEE9]" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-[35px] w-[100px] rounded-[30px] bg-[#F2EEE9]" />
                                    <Skeleton className="h-6 w-6 rounded-full bg-[#F2EEE9]" />
                                </div>
                            </div>
                            <div className="mt-5 space-y-5">
                                {[0, 1].map((item) => (
                                    <div key={item} className="flex items-center gap-5">
                                        <Skeleton className="h-[72px] w-[72px] shrink-0 rounded-[16px] bg-[#F2EEE9]" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-2/3 rounded-[10px] bg-[#F2EEE9]" />
                                            <Skeleton className="h-4 w-1/2 rounded-[10px] bg-[#F2EEE9]" />
                                        </div>
                                        <Skeleton className="h-5 w-16 rounded-[10px] bg-[#F2EEE9]" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </>
            )}

            {error && (
                <p role="alert" className="rounded-[30px] bg-white p-[30px] text-red-600">
                    {error}
                </p>
            )}

            {!isLoading && !error && orders.length === 0 && (
                <p className="rounded-[30px] bg-white p-[30px] text-[#777777]">
                    У вас пока нет заказов.
                </p>
            )}

            {orders.map((order) => {
                const isExpanded = expandedOrders.has(order.id);
                const status = orderStatusLabels[order.status] ?? order.status;

                return (
                    <section key={order.id} className="rounded-[30px] bg-white p-[30px] mt-[45px]">
                        <div className="flex items-center justify-between gap-5">
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                                <h2 className="text-[24px] font-bold">Заказ #{order.id}</h2>
                                <time className="text-[16px] text-[#AEAEAE]" dateTime={order.createdAt}>
                                    {new Date(order.createdAt).toLocaleString("ru-RU")}
                                </time>
                            </div>

                            <div className="flex shrink-0 items-center gap-4">
                                <span className="rounded-[30px] bg-[#EAF8F4] px-4 py-2 text-[14px] font-medium text-[#1BB486]">
                                    {status}
                                </span>
                                <button
                                    type="button"
                                    aria-label={`${isExpanded ? "Скрыть" : "Показать"} товары заказа ${order.id}`}
                                    aria-expanded={isExpanded}
                                    onClick={() => {
                                        setExpandedOrders((current) => {
                                            const next = new Set(current);
                                            if (next.has(order.id)) next.delete(order.id);
                                            else next.add(order.id);
                                            return next;
                                        });
                                    }}
                                >
                                    <ChevronDown
                                        color="#AEAEAE"
                                        className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                    />
                                </button>
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="mt-5 max-h-[300px] overflow-y-auto">
                                {order.items.map((item) => (
                                    <CheckoutCard key={item.id} item={item} readOnly />
                                ))}
                                <div className="mt-5 flex justify-between border-t border-[#EDEDED] pt-4 font-bold">
                                    <span>Итого</span>
                                    <span>{order.totalAmount} ₴</span>
                                </div>
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}
