'use client'

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100dvh-100px)] flex-col items-center justify-center gap-8 px-4 py-8 text-center md:min-h-[calc(100vh-150px)] md:flex-row md:gap-12 md:text-left lg:gap-[80px]">
      <div className="w-full max-w-[450px]">
        <h1 className="text-3xl font-black sm:text-[40px]">Страница не найдена</h1>
        <p className="w-full text-base text-[#999999] sm:text-[20px]">
          Проверьте корректность введённого адреса или повторите попытку позже
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-5 md:justify-start">
          <Link href="/" className="flex h-12 w-[150px] items-center justify-center gap-2 rounded-[15px] border border-[#FE5F00] font-bold text-[#FE5F00] sm:w-[160px]">
            <ArrowLeft />
            На главную
          </Link>
          <button onClick={() => window.location.reload()} className="flex h-12 w-[150px] items-center justify-center gap-2 rounded-[15px] border border-[#898989] font-bold text-[#898989] sm:w-[160px]">
            Обновить
          </button>
        </div>

      </div>
      <div className="w-full max-w-[480px]">
        <img
          src="/img/not-found/Layer 2.png"
          alt="404"
          className="h-auto w-full object-contain"
        />
      </div>
    </main>
  );
}