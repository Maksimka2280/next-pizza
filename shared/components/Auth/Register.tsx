'use client';
import { X } from 'lucide-react';
import { RegisterForm } from './RgisterForm';
import { Title } from '../shared/Title';

interface Props {
    onClose: () => void;
}

export const RegisterWindow = ({ onClose }: Props) => {
 


    return (

        <div className="fixed inset-0 z-50 bg-black/50">
            <div className="absolute right-[50%] top-[50%] flex max-h-[80vh] w-[450px] max-w-[95vw] translate-x-[50%] translate-y-[-50%] flex-col gap-[20px] rounded-[15px] bg-[#F4F1EE] p-[24px] md:p-[40px] overflow-auto">
                <div className="flex items-center justify-center gap-[18px]">
                    <div>
                        <Title text="Регистрация" size="lg" className="font-bold" />
                        <p className="text-[#7C7C7C]">Введите свои данные для регистрации</p>
                    </div>
                    <img src="/img/auth-img/Loginacc.svg" alt="Pizza Logo" className="h-[60px] w-[60px]" />
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Закрити реєстрацію"
                    className="absolute right-5 top-4 text-2xl text-[#7C7C7C] hover:text-black"
                >
                    <X />
                </button>
               <RegisterForm />
            </div>

        </div>
    );
};