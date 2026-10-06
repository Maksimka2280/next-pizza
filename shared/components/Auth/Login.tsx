'use client';

import { useState } from 'react';
import { Input } from '@base-ui/react/input';
import toast from 'react-hot-toast';

import { Title } from '../shared/Title';
import { Button } from '../ui/button';
import { sendEmail } from '@/actions/EmailActions';
import { loginSchema } from './LoginValidate';
import { Form, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { X } from 'lucide-react';

interface Props {
  onRegister: () => void;
  onClose: () => void;
}

export const LoginWindow = ({ onRegister, onClose }: Props) => {
  const [email, setEmail] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      Email: '',
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit
  } = form
  const handleSendCode = async () => {

    setIsSendingCode(true);

    try {
      await sendEmail(email);
      toast.success('Код підтвердження надіслано на вашу пошту');
    } catch (error) {
      console.error(error);
      toast.error('Не вдалося надіслати код підтвердження');
    } finally {
      setIsSendingCode(false);
    }
  };

  return (

    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="relative flex h-[405px] w-[450px] flex-col gap-[20px] rounded-[15px] bg-[#F4F1EE] p-[40px]">

        <div className="flex items-center justify-center gap-[18px]">
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
          <form onSubmit={form.handleSubmit(handleSendCode)} className="flex flex-col ">

            <Input
              {...register("Email")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              inputMode="email"
              autoComplete="email"
              type="email"
              aria-invalid={!!errors.Email}
              placeholder="example@example.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
            />
            {
              errors.Email && (
                <p className=' mt-1 text-sm text-red-500'>
                  {errors.Email.message}
                </p>
              )
            }
            <Button
              type="submit"
              disabled={isSendingCode}
              className="rounded-[18px] py-[25px] mt-4 text-[16px] font-extrabold disabled:opacity-70"
            >
              {isSendingCode ? 'Надсилаємо код...' : 'Получить код'}
            </Button>
          </form>

          <Button
            type="button"
            onClick={onRegister}
            className="rounded-[18px] py-[25px] text-[16px] font-extrabold disabled:opacity-70"
          >
            Зарегистрироваться
          </Button>


        </div>
      </div>
    </div>
  );
};