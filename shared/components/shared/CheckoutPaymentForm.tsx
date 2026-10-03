'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@base-ui/react/input';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { checkoutPaymentSchema } from '../CheckOutComponents/CheckoutValidate';
import { useRouter } from 'next/navigation';
import { useCart } from '../../hooks/useCart';

type CheckoutPaymentFormProps = {
    total: number;
    onPay: (totalAmount: number) => Promise<boolean>;
    onClose: () => void;
};

type CheckoutPaymentFormValues = z.infer<typeof checkoutPaymentSchema>;

export const CheckoutPaymentForm = ({ total, onPay, onClose }: CheckoutPaymentFormProps) => {
    const router = useRouter();
    const fallback = useCart();
    const effectiveClear = fallback.clearCart
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CheckoutPaymentFormValues>({
        resolver: zodResolver(checkoutPaymentSchema),
        mode: 'onSubmit',
        defaultValues: { cardNumber: '', cardholder: '', expiry: '', cvv: '' },
    });
    const submitPayment = async () => {
        try {
            const isCheckoutValid = await onPay(total);
            if (!isCheckoutValid) {
                onClose();
                toast.error('Проверьте данные заказа');
                return;
            }
            onClose();
            router.push('/orders');
            effectiveClear()
            toast.success('Заказ оформлен. Это тестовая оплата.');
        } catch {
            toast.error('Не удалось оформить заказ');
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isSubmitting) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="payment-modal-title"
                className="relative my-auto w-full max-w-[480px] rounded-[24px] bg-white p-6 shadow-2xl sm:p-8"
            >
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    aria-label="Закрыть"
                    className="absolute right-5 top-4 text-3xl leading-none text-gray-500 hover:text-gray-900 disabled:opacity-50"
                >
                    ×
                </button>
                <h2 id="payment-modal-title" className="pr-8 text-2xl font-bold text-gray-900">Оплата картой</h2>
                <p className="mt-2 text-sm text-gray-500">Тестовая форма: введённые данные карты не сохраняются и не отправляются.</p>

                <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit(submitPayment)}>
                    <label className="block text-sm font-medium text-gray-700">
                        Номер карты
                        <Controller
                            control={control}
                            name="cardNumber"
                            render={({ field }) => (
                                <input
                                    {...field}
                                    autoFocus
                                    inputMode="numeric"
                                    autoComplete="cc-number"
                                    placeholder="0000 0000 0000 0000"
                                    onChange={(event) => {
                                        const digits = event.target.value.replace(/\D/g, '').slice(0, 16);
                                        field.onChange(digits.replace(/(\d{4})(?=\d)/g, '$1 '));
                                    }}
                                    aria-invalid={Boolean(errors.cardNumber)}
                                    aria-describedby={errors.cardNumber ? 'card-number-error' : undefined}
                                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
                                />
                            )}
                        />
                        {errors.cardNumber && <span id="card-number-error" className="mt-1 block text-sm text-red-600">{errors.cardNumber.message}</span>}
                    </label>

                    <label className="block text-sm font-medium text-gray-700">
                        Имя владельца карты
                        <Controller
                            control={control}
                            name="cardholder"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="cc-name"
                                    placeholder="Как указано на карте"
                                    aria-invalid={Boolean(errors.cardholder)}
                                    aria-describedby={errors.cardholder ? 'cardholder-error' : undefined}
                                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
                                />
                            )}
                        />
                        {errors.cardholder && <span id="cardholder-error" className="mt-1 block text-sm text-red-600">{errors.cardholder.message}</span>}
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Срок действия
                            <Controller
                                control={control}
                                name="expiry"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        inputMode="numeric"
                                        autoComplete="cc-exp"
                                        placeholder="ММ/ГГ"
                                        onChange={(event) => {
                                            const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
                                            field.onChange(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                                        }}
                                        aria-invalid={Boolean(errors.expiry)}
                                        aria-describedby={errors.expiry ? 'card-expiry-error' : undefined}
                                        className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
                                    />
                                )}
                            />
                            {errors.expiry && <span id="card-expiry-error" className="mt-1 block text-sm text-red-600">{errors.expiry.message}</span>}
                        </label>
                        <label className="block text-sm font-medium text-gray-700">
                            CVV / CVC
                            <Controller
                                control={control}
                                name="cvv"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        inputMode="numeric"
                                        autoComplete="cc-csc"
                                        type="password"
                                        maxLength={4}
                                        placeholder="•••"
                                        onChange={(event) => field.onChange(event.target.value.replace(/\D/g, '').slice(0, 4))}
                                        aria-invalid={Boolean(errors.cvv)}
                                        aria-describedby={errors.cvv ? 'card-cvv-error' : undefined}
                                        className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 aria-invalid:border-red-500"
                                    />
                                )}
                            />
                            {errors.cvv && <span id="card-cvv-error" className="mt-1 block text-sm text-red-600">{errors.cvv.message}</span>}
                        </label>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="mt-2 h-12 w-full rounded-xl text-base font-bold">
                        {isSubmitting ? 'Обработка...' : `Подтвердить оплату ${total} ₴`}
                    </Button>
                </form>
            </section>
        </div>
    );
};
