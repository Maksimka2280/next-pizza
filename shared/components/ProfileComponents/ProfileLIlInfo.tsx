import Link from "next/link";
import { ArrowUpRight, Box, Heart } from "lucide-react";

interface ProfileLilInfoProps {
  orderCount: number | null;
  favoriteCount: number | null;
}

const cards = [
  {
    title: "Мои заказы",
    description: "История и статусы доставок",
    href: "/profile/orders",
    Icon: Box,
    countKey: "orderCount",
  },
  {
    title: "Избранное",
    description: "Блюда, которые вам нравятся",
    href: "/profile/favorites",
    Icon: Heart,
    countKey: "favoriteCount",
  },
] as const;

export const ProfileLilInfo = ({
  orderCount,
  favoriteCount,
}: ProfileLilInfoProps) => {
  const counts = { orderCount, favoriteCount };

  return (
    <section aria-label="Разделы профиля" className="grid gap-4 sm:grid-cols-2">
      {cards.map(({ title, description, href, Icon, countKey }) => (
        <Link
          key={href}
          href={href}
          className="group flex items-center gap-4 rounded-2xl border border-[#F0ECE8] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#FFD2B8] hover:shadow-md sm:p-6"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E7] text-[#FE5F00]">
            <Icon size={23} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-bold text-[#292929]">
              {title}
            </span>
            <span className="mt-1 block text-sm text-[#888]">{description}</span>
          </span>
          <span className="flex items-center gap-2 text-[#FE5F00]">
            <span className="text-xl font-bold">{counts[countKey] ?? "—"}</span>
            <ArrowUpRight
              size={18}
              className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </Link>
      ))}
    </section>
  );
};
