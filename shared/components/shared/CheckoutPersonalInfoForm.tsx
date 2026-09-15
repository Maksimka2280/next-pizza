"use client";

import { useFormContext } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { Title } from "./Title";
import { CheckoutField } from "../CheckOutComponents/CheckoutField";

export const CheckoutPersonalInfoForm = () => {
  const methods = useFormContext();

  return (
    <div className="w-full max-w-[750px] rounded-[30px] bg-white px-[30px] py-[30px]">
      <Title text="2. Персональная информация" className="mb-[24px] font-bold" size="md" />
      <div className="my-[25px] h-[1px] w-full bg-[#EDEDED]" />
      <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
        <CheckoutField name="firstName" label="Имя" placeholder="Введіть ваше ім'я" autoComplete="given-name" />

        <CheckoutField name="lastName" label="Фамилия" placeholder="Введіть вашу фамілію" autoComplete="family-name" />

        <CheckoutField name="email" label="E-Mail" placeholder="vasya@pupkin.ua" type="email" autoComplete="email" />

        <CheckoutField name="phone" label="Телефон" placeholder="+380 99 123 45 67" type="tel" autoComplete="tel" inputMode="tel" />
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export const FormPersonalInfo = CheckoutPersonalInfoForm;