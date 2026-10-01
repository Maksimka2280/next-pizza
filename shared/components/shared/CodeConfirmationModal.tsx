'use client';

import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { Button } from '../ui/button';

type CodeConfirmationModalProps = {
  isOpen: boolean;
  phone: string;
  codeDigits: string[];
  isVerifying: boolean;
  isResendDisabled: boolean;
  resendCountdown: number;
  onClose: () => void;
  onResend: () => void;
  onSubmit: (code: string) => void;
  onDigitChange: (index: number, value: string) => void;
  onDigitKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
};

export const CodeConfirmationModal = ({
  isOpen,
  phone,
  codeDigits,
  isVerifying,
  isResendDisabled,
  resendCountdown,
  onClose,
  onResend,
  onSubmit,
  onDigitChange,
  onDigitKeyDown,
}: CodeConfirmationModalProps) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/30 backdrop-blur-[1px]">
      <div className="relative w-full max-w-[520px] rounded-[30px] bg-[#F4F4F4] px-8 py-7 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full text-[34px] font-light leading-none text-[#4B4B4B] transition hover:text-[#111111]"
          aria-label="Закрыть"
        >
          ×
        </button>

        <h3 className="pt-2 text-center text-[42px] font-normal leading-[1.15] text-[#1A1A1A]">
          Введите код
        </h3>

        <p className="mt-4 text-center text-[19px] leading-[1.5] text-[#5F5F5F]">
          SMS-код был отправлен на номер<br />
          телефона {phone}
        </p>

        <div className="mt-7 flex items-center justify-center gap-[10px]">
          {codeDigits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(event) => onDigitChange(index, event.target.value)}
              onKeyDown={(event) => onDigitKeyDown(index, event)}
              className="h-[78px] w-[68px] rounded-[12px] border border-[#E5E7EB] bg-white text-center text-[28px] font-semibold text-[#111827] outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
            />
          ))}
        </div>

        <button
          type="button"
          disabled={isResendDisabled || isVerifying}
          onClick={() => {
            if (isResendDisabled) {
              return;
            }

            onResend();
          }}
          className="mt-8 flex h-[58px] w-full items-center justify-center rounded-[16px] bg-[#D9D9D9] text-[20px] font-medium text-[#000000] disabled:cursor-not-allowed disabled:opacity-100"
        >
          {isResendDisabled ? `Запросить код — через ${resendCountdown} сек.` : 'Запросить код'}
        </button>

        <Button
          type="button"
          onClick={() => onSubmit(codeDigits.join(''))}
          disabled={isVerifying}
          className="mt-4 h-[58px] w-full rounded-[16px] bg-[#FE5F00] text-[18px] font-extrabold text-white shadow-none hover:bg-[#e75400]"
        >
          {isVerifying ? 'Проверяем...' : 'Подтвердить'}
        </Button>
      </div>
    </div>
  );
};
