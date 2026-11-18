"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProductModalCloseButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Закрыть окно"
      className="absolute -right-9 -top-3 z-50 flex size-10 items-center justify-center rounded-full bg-transparent text-[#FE5F00] transition hover:text-[#D94E00] [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.8))]"
    >
      <X size={22} strokeWidth={2.5} />
    </button>
  );
}
