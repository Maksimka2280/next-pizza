import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock3, PackageCheck } from "lucide-react";
import type { OrderDto } from "../../types/cart.dto";

const statusLabels: Record<string, string> = {
  PENDING: "Ожидает оплаты",
  SUCCEEDED: "Оплачен",
  CANCELLED: "Отменён",
};

interface ProfileRecentOrderProps {
  order: OrderDto | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasError: boolean;
}

export function ProfileRecentOrder({
  order,
  isLoading,
  isAuthenticated,
  hasError,
}: ProfileRecentOrderProps) {
  return (
    <section className="rounded-3xl border border-[#F0ECE8] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#929292]">Всё под контролем</p>
          <h2 className="mt-1 text-xl font-bold text-[#292929]">
            Последний заказ
          </h2>
        </div>
        <Link
          href="/profile/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#FE5F00] hover:underline"
        >
          Все заказы <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-5 rounded-2xl bg-[#FAF8F6] p-5">
        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-[#777]">
            <Clock3 size={17} aria-hidden="true" /> Загружаем данные заказа…
          </p>
        ) : order ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-white p-3 text-[#FE5F00] shadow-sm">
                  <PackageCheck size={22} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold text-[#292929]">Заказ №{order.id}</p>
                  <p className="mt-1 text-sm text-[#888]">
                    {new Intl.DateTimeFormat("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(order.createdAt))}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-bold text-[#292929]">{order.totalAmount} ₴</p>
                <p className="mt-1 text-sm font-medium text-[#FE5F00]">
                  {statusLabels[order.status] ?? order.status}
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {order.items.slice(0, 2).map((item, index) => {
                const product = item.productItem.product;
                const ingredients = item.ingredients
                  .map(({ name }) => name)
                  .filter(Boolean);

                return (
                  <div
                    key={`${product.id}-${index}`}
                    className="flex items-center gap-4 rounded-xl bg-white p-3"
                  >
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={64}
                        height={64}
                        unoptimized
                        className="size-16 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-[#FFF0E7] text-xs text-[#FE5F00]">
                        Фото нет
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#292929]">
                        {product.name}
                      </p>
                      <p className="mt-1 text-sm text-[#888]">
                        {item.quantity} шт.
                        {ingredients.length > 0 && ` · ${ingredients.join(", ")}`}
                      </p>
                    </div>
                  </div>
                );
              })}
              {order.items.length > 2 && (
                <p className="px-1 text-sm text-[#888]">
                  И ещё {order.items.length - 2}{" "}
                  {order.items.length - 2 === 1 ? "товар" : "товара"}
                </p>
              )}
            </div>
          </>
        ) : hasError ? (
          <p className="text-sm text-[#777]">Информация о заказе недоступна.</p>
        ) : isAuthenticated ? (
          <p className="text-sm text-[#777]">
            У вас пока нет заказов. Самое время выбрать что-нибудь вкусное!
          </p>
        ) : (
          <p className="text-sm text-[#777]">
            <Link href="/login" className="font-semibold text-[#FE5F00] hover:underline">
              Войдите в аккаунт
            </Link>
            , чтобы увидеть историю заказов.
          </p>
        )}
      </div>
    </section>
  );
}
