'use client';

import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import toast from 'react-hot-toast';
import { sendEmail, verifyEmailCode } from '@/actions/EmailActions';

const CODE_LENGTH = 4;

type UseCodeConfirmationOptions = {
  getEmail: () => string;
  onPay: () => Promise<void>;
  fallbackPhone?: string;
};

export const useCodeConfirmation = ({
  getEmail,
  onPay,
  fallbackPhone = '+7 (921) 450-20-25',
}: UseCodeConfirmationOptions) => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(28);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  useEffect(() => {
    if (!isCodeModalOpen || !isResendDisabled) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCountdown((current) => {
        if (current <= 1) {
          setIsResendDisabled(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isCodeModalOpen, isResendDisabled]);

  const closeModal = () => {
    setIsCodeModalOpen(false);
    setCodeDigits(Array(CODE_LENGTH).fill(''));
  };

  const openCodeModal = async () => {
    const email = getEmail();

    if (!email) {
      toast.error('Спочатку введіть email');
      return false;
    }

    try {
      await sendEmail(email);
      setIsCodeSent(true);
      setIsCodeModalOpen(true);
      setIsResendDisabled(true);
      setResendCountdown(28);
      setCodeDigits(Array(CODE_LENGTH).fill(''));
      toast.success('Код підтвердження надіслано на вашу пошту. Перевірте inbox.');
      return true;
    } catch (error) {
      console.error(error);
      toast.error('Не вдалося надіслати код підтвердження');
      return false;
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const nextChar = value.replace(/\D/g, '').slice(0, 1);
    const nextDigits = [...codeDigits];

    nextDigits[index] = nextChar;
    setCodeDigits(nextDigits);

    if (nextChar && index < CODE_LENGTH - 1) {
      const nextInput = document.querySelectorAll<HTMLInputElement>('input[inputmode="numeric"]')[index + 1];
      nextInput?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !codeDigits[index] && index > 0) {
      const previousInput = document.querySelectorAll<HTMLInputElement>('input[inputmode="numeric"]')[index - 1];
      previousInput?.focus();
    }
  };

  const submitCode = async (enteredCode = codeDigits.join('')) => {
    const email = getEmail();

    if (!email) {
      toast.error('Спочатку введіть email');
      return false;
    }

    const normalizedCode = enteredCode.trim();

    if (!normalizedCode || normalizedCode.length !== CODE_LENGTH) {
      toast.error('Введіть код підтвердження');
      return false;
    }

    setIsVerifying(true);

    try {
      const isValid = await verifyEmailCode(email, normalizedCode);

      if (!isValid) {
        toast.error('Невірний код підтвердження');
        return false;
      }

      closeModal();
      await toast.promise(onPay, {
        loading: 'Підтвердження...',
        success: 'Замовлення успішно оформлене. Перехід до оплати.',
        error: 'Не вдалося оформити замовлення',
      });

      return true;
    } catch (error) {
      console.error(error);
      toast.error('Щось пішло не так');
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    isCodeSent,
    isCodeModalOpen,
    codeDigits,
    isVerifying,
    isResendDisabled,
    resendCountdown,
    phone: fallbackPhone,
    closeModal,
    openCodeModal,
    handleDigitChange,
    handleDigitKeyDown,
    submitCode,
  };
};
