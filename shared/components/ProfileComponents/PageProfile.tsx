"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileLilInfo } from "./ProfileLIlInfo";
import { ProfileRecentOrder } from "./ProfileRecentOrder";
import { useProfileOverview } from "../../hooks/useProfileOverview";

export const PageProfile = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { orderCount, favoriteCount, recentOrder, isLoading, error } =
    useProfileOverview(session?.user?.id, status);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-r from-[#FE5F00] to-[#FF914D] p-6 text-white shadow-sm sm:flex-row sm:items-center sm:p-8">
        <div className="flex items-start gap-4">
          <span className="rounded-2xl bg-white/20 p-3">
            <Sparkles size={25} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white/80">Личный кабинет</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Рады видеть, {session?.user?.name?.split(" ")[0] || "вас"}!
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/90">
              Здесь собраны ваши заказы, любимые блюда и данные аккаунта.
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#FE5F00] transition hover:bg-orange-50 sm:self-center"
        >
          Перейти в меню <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>

      <ProfileInfo user={session?.user} />

      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <ProfileLilInfo
        orderCount={isAuthenticated ? orderCount : null}
        favoriteCount={isAuthenticated ? favoriteCount : null}
      />
      <ProfileRecentOrder
        order={recentOrder}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        hasError={Boolean(error)}
      />
    </div>
  );
};
