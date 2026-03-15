"use client"

import { Input } from "@base-ui/react/input"


interface CustomInputProps {
  type?: "text" | "number" | "password" | string
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  width?: string 
}

export default function CustomInput({
  type = "text",
  value,
  onChange,
  placeholder,
  width = "100px",
}: CustomInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (type === "number") {
      onChange?.(val === "" ? "" : Number(val))
    } else {
      onChange?.(val)
    }
  }

  return (
    <div
      className="flex items-center rounded-[10px] border border-[#F0F0F0] px-[15px]"
      style={{ width: width, height: "40px" }}
    >
      <Input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`flex-1 h-full w-full border-0 bg-transparent text-black text-[14px] focus:outline-none
          ${type === "number" ? "" : ""}`}
      />
      {type === "number" && (
        <img
          src="/img/filters-icon/free-icon-hryvnia-14674701.png"
          alt="гривна"
          className="w-[15px] h-[15px] "
          style={{ filter: "brightness(0) saturate(100%) invert(75%)" }}
        />
      )}
    </div>
  )
}