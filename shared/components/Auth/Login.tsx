'use client';

import { Input } from '@base-ui/react/input';

import { Title } from '../shared/Title';
import { Button } from '../ui/button';

interface Props {
  onClose: () => void;
}

export const LoginWindow = ({ onClose }: Props) => {


  return (

    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute right-[50%] top-[50%] flex h-[360px] w-[450px] translate-x-[50%] translate-y-[-50%] flex-col gap-[20px] rounded-[15px] bg-[#F4F1EE] p-[40px]">
        <div className="flex items-center justify-center gap-[18px]">
          <div>
            <Title text="Вход в аккаунт" size="lg" className="font-bold" />
            <p className="text-[#7C7C7C]">Введите адрес электронной почты, чтобы войти или зарегистрироваться</p>
          </div>
          <img src="/img/auth-img/Loginacc.svg" alt="Pizza Logo" className="h-[60px] w-[60px]" />
        </div>

        <div className="flex flex-col gap-[20px]">
          <Input

            inputMode="email"
            autoComplete="email"
            type="email"
            placeholder="example@example.com"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
          />


          <Button
            type="button"

            className="rounded-[18px] py-[25px] text-[16px] font-extrabold disabled:opacity-70"
          >
            Получить код
          </Button>

        </div>

      </div>

    </div>
  );
};