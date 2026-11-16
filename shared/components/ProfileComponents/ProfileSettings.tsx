"use client";

import Link from "next/link";
import { ArrowLeft, Moon, Sun, Zap } from "lucide-react";
import { useSitePreferences } from "../shared/SitePreferencesProvider";

function SettingSwitch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  disabled: boolean;
}) {
  return (
    <label className="inline-flex shrink-0 cursor-pointer items-center">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        aria-label={label}
        disabled={disabled}
        onChange={(event) => onChange(event.currentTarget.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        data-checked={checked}
        className="setting-switch-track relative h-7 w-12 rounded-full transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#FE5F00] peer-disabled:cursor-wait peer-disabled:opacity-70"
      >
        <span
          className={`setting-switch-thumb absolute left-1 top-1 size-5 rounded-full shadow-sm transition-transform ${
            checked ? "translate-x-6" : ""
          }`}
        />
      </span>
    </label>
  );
}

export function ProfileSettings() {
  const { isDark, reduceMotion, isReady, setIsDark, setReduceMotion } =
    useSitePreferences();

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header className="flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-r from-[#FE5F00] to-[#FF914D] p-6 text-white shadow-sm sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="text-sm font-semibold text-white/80">Личный кабинет</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Настройки</h1>
          <p className="mt-2 text-sm text-white/90">
            Настройте внешний вид сайта под себя.
          </p>
        </div>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#FE5F00] transition hover:bg-orange-50 sm:self-center"
        >
          <ArrowLeft size={17} aria-hidden="true" /> В профиль
        </Link>
      </header>

      <div className="overflow-hidden rounded-3xl border border-[#F0ECE8] bg-white shadow-sm">
        <div className="flex items-center gap-4 p-5 sm:p-6">
          <span className="rounded-xl bg-[#FFF0E7] p-3 text-[#FE5F00]">
            {isDark ? <Moon size={22} /> : <Sun size={22} />}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-[#292929]">Тёмная тема</h2>
            <p className="mt-1 text-sm text-[#888]">
              Переключить оформление сайта на тёмное.
            </p>
          </div>
          <SettingSwitch
            checked={isDark}
            onChange={setIsDark}
            label="Тёмная тема"
            disabled={!isReady}
          />
        </div>
        <div className="mx-5 border-t border-[#F0ECE8] sm:mx-6" />
        <div className="flex items-center gap-4 p-5 sm:p-6">
          <span className="rounded-xl bg-[#FFF0E7] p-3 text-[#FE5F00]">
            <Zap size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-[#292929]">Меньше анимации</h2>
            <p className="mt-1 text-sm text-[#888]">
              Уменьшить движение и переходы на страницах.
            </p>
          </div>
          <SettingSwitch
            checked={reduceMotion}
            onChange={setReduceMotion}
            label="Меньше анимации"
            disabled={!isReady}
          />
        </div>
      </div>
      <p className="text-center text-xs text-[#929292]">
        Настройки сохраняются в этом браузере.
      </p>
    </section>
  );
}
