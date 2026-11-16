import { OrdersWindow } from "../OrdersPageComponents/OrderWindow";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";

export const OrdersPage = ({ token }: { token?: string }) => {
  return (
    <main className="mx-auto w-full max-w-6xl">
      <header className="flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-r from-[#FE5F00] to-[#FF914D] p-6 text-white shadow-sm sm:flex-row sm:items-center sm:p-8">
        <div className="flex items-start gap-4">
          <span className="rounded-2xl bg-white/20 p-3">
            <ClipboardList size={25} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white/80">Личный кабинет</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Мои заказы</h1>
            <p className="mt-2 text-sm text-white/90">
              Следите за историей покупок, составом и статусом заказов.
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#FE5F00] transition hover:bg-orange-50 sm:self-center"
        >
          <ArrowLeft size={17} aria-hidden="true" /> В меню
        </Link>
      </header>
      <OrdersWindow token={token} />
    </main>
  );
};