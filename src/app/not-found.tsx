'use client'

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="h-[calc(100vh-150px)] flex items-center justify-center gap-[80px]">
      <div>
        <h1 className="text-[40px] font-black">Страница не найдена</h1>
        <p className="text-[20px] text-[#999999] max-w-[450px] w-full">
          Проверьте корректность введённого адреса или повторите попытку позже
        </p>
        <div className="flex gap-5 mt-10">
          <Link href="/" className=" gap-2 text-[#FE5F00] font-bold border-[#FE5F00] border rounded-[15px] w-[160px] h-[50px] flex justify-center items-center">
            <ArrowLeft />
            На главную
          </Link>
          <button onClick={() => window.location.reload()} className=" gap-2 text-[#898989] font-bold border-[#898989] border rounded-[15px] w-[160px] h-[50px] flex justify-center items-center">
            Обновить
          </button>
        </div>

      </div>
      <div>
        <img
          src="/img/not-found/Layer 2.png"
          alt="404"
          className=""
        />
      </div>
    </main>
  );
}