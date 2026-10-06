'use client';

import { useRef, useState } from 'react';
import { Input } from '@base-ui/react/input';
import toast from 'react-hot-toast';

import { Title } from '../shared/Title';
import { Button } from '../ui/button';
import {
    registerUser,
    sendRegistrationCode,
    verifyRegistrationCode,
} from '@/actions/EmailActions';
import { X } from 'lucide-react';

interface Props {
    onClose: () => void;
}

export const RegisterWindow = ({ onClose }: Props) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSendCode = async () => {
        if (!formRef.current?.reportValidity()) {
            return;
        }

        if (!email.trim()) {
            toast.error('Спочатку введіть email');
            return;
        }

        setIsSendingCode(true);
        try {
            await sendRegistrationCode(email);
            setIsCodeSent(true);
            setIsEmailVerified(false);
            setCode('');
            toast.success('Код підтвердження надіслано на вашу пошту');
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : 'Не вдалося надіслати код підтвердження');
        } finally {
            setIsSendingCode(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!/^\d{4}$/.test(code)) {
            toast.error('Введіть чотиризначний код підтвердження');
            return;
        }

        setIsVerifyingCode(true);
        try {
            const isValid = await verifyRegistrationCode(email, code);
            if (!isValid) {
                toast.error('Невірний код підтвердження');
                return;
            }

            setIsEmailVerified(true);
            toast.success('Email підтверджено');
        } catch (error) {
            console.error(error);
            toast.error('Не вдалося перевірити код підтвердження');
        } finally {
            setIsVerifyingCode(false);
        }
    };

    const handleRegister = async () => {
        if (!formRef.current?.reportValidity() || !isEmailVerified) {
            return;
        }

        setIsRegistering(true);
        try {
            const isRegistered = await registerUser(name, email, password, code);
            if (!isRegistered) {
                setIsEmailVerified(false);
                toast.error('Не вдалося завершити реєстрацію. Перевірте код і спробуйте ще раз.');
                return;
            }

            toast.success('Реєстрація успішна');
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Не вдалося завершити реєстрацію');
        } finally {
            setIsRegistering(false);
        }
    };

    return (

        <div className="fixed inset-0 z-50 bg-black/50">
            <div className="absolute right-[50%] top-[50%] flex h-[535px] w-[450px] translate-x-[50%] translate-y-[-50%] flex-col gap-[20px] rounded-[15px] bg-[#F4F1EE] p-[40px]">
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
                    <X/>
                </button>

                <form
                    ref={formRef}
                    onSubmit={(event) => event.preventDefault()}
                    className="flex flex-col gap-[20px]"
                >
                    <Input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        inputMode="text"
                        autoComplete="additional-name"
                        type="text"
                        required
                        minLength={2}
                        placeholder="Имя"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
                    />
                    <Input
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                            setIsCodeSent(false);
                            setIsEmailVerified(false);
                            setCode('');
                        }}
                        inputMode="email"
                        autoComplete="email"
                        type="email"
                        required
                        placeholder="example@example.com"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
                    />
                    <Input
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        type="password"
                        required
                        minLength={8}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
                    />

                    <Button
                        type="button"
                        onClick={handleSendCode}
                        disabled={isSendingCode}
                        className="rounded-[18px] py-[25px] text-[16px] font-extrabold disabled:opacity-70"
                    >
                        {isSendingCode ? 'Надсилаємо код...' : 'Получить код'}
                    </Button>
                    {isCodeSent && !isEmailVerified && (
                        <>
                            <Input
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                type="text"
                                required
                                pattern="\d{4}"
                                maxLength={4}
                                value={code}
                                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="Код із листа"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
                            />
                            <Button
                                type="button"
                                onClick={handleVerifyCode}
                                disabled={isVerifyingCode}
                                className="rounded-[18px] py-[25px] text-[16px] font-extrabold disabled:opacity-70"
                            >
                                {isVerifyingCode ? 'Перевіряємо...' : 'Підтвердити код'}
                            </Button>
                        </>
                    )}
                    {isEmailVerified && (
                        <Button
                            type="button"
                            onClick={handleRegister}
                            disabled={isRegistering}
                            className="rounded-[18px] py-[25px] text-[16px] font-extrabold disabled:opacity-70"
                        >
                            {isRegistering ? 'Реєструємо...' : 'Зарегистрироваться'}
                        </Button>
                    )}
                </form>

            </div>

        </div>
    );
};