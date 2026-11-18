import { ChevronDown } from "lucide-react";
import type { OrderHistoryDto } from "../../types/cart.dto";
import { CheckoutCard } from "../CheckOutComponents/CheckoutCard";

const statusLabels: Record<string, string> = {
  PENDING: "Ожидает оплаты",
  SUCCEEDED: "Оплачено",
  CANCELLED: "Отменено",
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  SUCCEEDED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

interface OrderCardProps {
  order: OrderHistoryDto;
  isExpanded: boolean;
  onToggle: (orderId: number) => void;
}

export function OrderCard({ order, isExpanded, onToggle }: OrderCardProps) {
  const date = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(order.createdAt));

  return (
    <article className="rounded-3xl border border-[#F0ECE8] bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#292929]">Заказ №{order.id}</h2>
          <time className="mt-1 block text-sm text-[#929292]" dateTime={order.createdAt}>
            {date}
          </time>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-2 text-xs font-semibold ${
              statusStyles[order.status] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {statusLabels[order.status] ?? order.status}
          </span>
          <button
            type="button"
            aria-label={`${isExpanded ? "Скрыть" : "Показать"} товары заказа ${order.id}`}
            aria-expanded={isExpanded}
            onClick={() => onToggle(order.id)}
            className="rounded-full p-2 text-[#777] transition hover:bg-[#FFF0E7] hover:text-[#FE5F00]"
          >
            <ChevronDown
              size={20}
              className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4  pt-1">
          <div className="max-h-[360px] overflow-y-auto">
            {order.items.map((item, index) => (
              <CheckoutCard
                key={`${item.id}-${index}`}
                item={item}
                readOnly
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-[#F0ECE8] pt-4 font-bold text-[#292929]">
            <span>Итого</span>
            <span>{order.totalAmount} ₴</span>
          </div>
        </div>
      )}
    </article>
  );
}
