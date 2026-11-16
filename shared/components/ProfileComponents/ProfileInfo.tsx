import { BadgeCheck, Mail, UserRound } from "lucide-react";

interface ProfileInfoProps {
  user:
    | {
        id?: string;
        name?: string | null;
        email?: string | null;
      }
    | undefined;
}

export const ProfileInfo = ({ user }: ProfileInfoProps) => (
  <section className="flex flex-col gap-6 rounded-3xl border border-[#F0ECE8] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
    <div className="flex min-w-0 flex-1 items-center gap-5">
      <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[#FFF0E7] text-[#FE5F00] sm:size-24">
        <UserRound size={42} strokeWidth={1.7} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#929292]">Ваш профиль</p>
        <h2 className="mt-1 truncate text-xl font-bold text-[#292929] sm:text-2xl">
          {user?.name || "Гость"}
        </h2>
        {user?.email ? (
          <p className="mt-2 flex min-w-0 items-center gap-2 text-sm text-[#777]">
            <Mail size={16} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{user.email}</span>
          </p>
        ) : (
          <p className="mt-2 text-sm text-[#777]">
            Войдите, чтобы просматривать свои заказы и избранное.
          </p>
        )}
      </div>
    </div>

    <div className="flex items-center gap-3 rounded-2xl bg-[#F8F7F5] p-4 sm:min-w-56">
      <span className="rounded-xl bg-white p-2.5 text-[#FE5F00] shadow-sm">
        <BadgeCheck size={22} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-[#929292]">ID аккаунта</p>
        <p className="mt-1 truncate font-semibold text-[#292929]">
          {user?.id ? `#${user.id}` : "Не выполнен вход"}
        </p>
      </div>
    </div>
  </section>
);
