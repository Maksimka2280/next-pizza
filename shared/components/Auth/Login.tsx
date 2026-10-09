'use client';

import { Title } from '../shared/Title';
import { X } from 'lucide-react';
import { useLoginForm } from '../../hooks/useLoginForm';
import { Button, Input } from '@base-ui/react';

interface Props {
  onRegister: () => void;
  onClose: () => void;
}

export const LoginWindow = ({ onRegister, onClose }: Props) => {
  const {
    form,
    register,
    errors,
    handleSubmit,
    isSendingCode,
    open,
    doYouRegister,
    handleSendCode,
  } = useLoginForm({ onRegister, onClose });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className='relative flex w-[450px] flex-col gap-[20px] rounded-[15px] bg-[#F4F1EE] p-[40px]'>

        <div className="flex items-center justify-center gap-[18px] pt-[10px]">
          <div>
            <Title text="Вход в аккаунт" size="lg" className="font-bold" />
            <p className="text-[#7C7C7C]">Введите адрес электронной почты, чтобы войти или зарегистрироваться</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити реєстрацію"
            className="absolute right-5 top-4 text-2xl text-[#7C7C7C] hover:text-black"
          >
            <X />
          </button>
          <img src="/img/auth-img/Loginacc.svg" alt="Pizza Logo" className="h-[60px] w-[60px]" />

        </div>
        <div className="flex flex-col gap-[20px]">
          <form noValidate onSubmit={handleSubmit(handleSendCode)} className="flex flex-col ">
            <Input
              {...register('Email')}
              inputMode="email"
              autoComplete="email"
              type="email"
              aria-invalid={!!errors.Email}
              placeholder="example@example.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
            />
            {errors.Email && <p className='mt-1 text-sm text-red-500'>{errors.Email.message}</p>}
            <Button
              type="submit"
              disabled={isSendingCode}
              className="mt-4 rounded-[18px] bg-[#FE5F00] py-[15px] text-[16px] font-extrabold text-white transition-opacity disabled:opacity-70"
            >
              {isSendingCode ? 'Надсилаємо код...' : 'Получить код'}
            </Button>
          </form>

          <button type="button" onClick={doYouRegister} className='text-[#7C7C7C]'> Нет аккаунта? </button>
          {open && (
            <Button
              type="button"
              onClick={onRegister}
              className="rounded-[18px] bg-[#FE5F00] py-[15px] text-[16px] font-extrabold text-white disabled:opacity-70"
            >
              Зарегистрироваться
            </Button>
          )}

        </div>
      </div>
    </div>
  );
};