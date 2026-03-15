"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface RadioProps {
  value: string
  checked: boolean
  onCheckedChange: () => void
  className?: string
}

export function Radio({ checked, onCheckedChange, className }: RadioProps) {
  return (
    <button
      type="button"
      onClick={onCheckedChange}
      className={cn(
        "flex items-center justify-center w-6 h-6 rounded-full cursor-pointer outline-none transition-colors",
        "bg-[#F1F1F1]",
        checked ? "bg-[#FE5F00]" : "",
        className
      )}
    >
      <span
        className={cn(
          "block w-3 h-3 rounded-full bg-white transition-opacity",
          checked ? "opacity-100" : "opacity-0"
        )}
      />
    </button>
  )
}
