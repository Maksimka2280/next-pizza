'use client';

import { Title } from '../shared/Title';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';

interface Props {
  onRegister: () => void;
  onClose: () => void;
}

export const LoginWindow = ({ onRegister, onClose }: Props) => {


  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className='relative flex w-[450px] flex-col gap-[20px] rounded-[15px] bg-[#F4F1EE] p-[40px]'>

        <div className="flex items-center justify-center gap-[18px] pt-[10px]">
          <div>
            <Title text="Вход в аккаунт" size="lg" className="font-bold" />
            <p className="text-[#7C7C7C]">Введите электронную почту, чтобы войти </p>
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
        <LoginForm onClose={onClose} onRegister={onRegister} />
      </div>
    </div>
  );
};