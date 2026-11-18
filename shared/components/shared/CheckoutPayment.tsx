'use client'
import { useState } from 'react';
import { Button } from '../ui/button';
import { CheckoutPaymentForm } from './CheckoutPaymentForm';
import { OrderDto } from '../../types/cart.dto';
import { calculateCheckoutTotal, DELIVERY_FEE, TAX_RATE_PERCENT } from '../../lib/checkout-pricing';

type Props = {
    sum: number;
    validateOrder: () => Promise<boolean>;
    onSubmit: () => Promise<OrderDto>;
};

export const CheckoutPayment = ({ sum, validateOrder, onSubmit }: Props) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const totalsum = calculateCheckoutTotal(sum);

    const submit = async () => {
        const isValid = await validateOrder();

        if (isValid) {
            setIsPaymentModalOpen(true);
        }
    };

    return (
        <>
            <div className="h-fit w-full rounded-2xl bg-[#FFFFFF] p-5 sm:rounded-[30px] sm:p-8 lg:p-[40px]">
                <div>
                    <div className="flex flex-col ">
                        <div>
                            <span className="text-[22px]">Итого:</span>
                            <h1 className="text-3xl font-black sm:text-[34px]">{totalsum} ₴</h1>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 ">
                        <div className="my-[15px] h-[1px] w-full bg-[#EDEDED]" />
                        <div className="flex items-center text-[15px] text-[#111827]">
                            <span className="whitespace-nowrap text-sm sm:text-[18px]">Стоимость товаров:</span>
                            <span className="flex-1 mx-3 border-b border-dotted border-[#E5E7EB]" />
                            <span className="whitespace-nowrap text-sm font-semibold sm:text-[18px]"> {sum} ₴</span>
                        </div>

                        <div className="flex items-center text-[15px] text-[#111827]">
                            <span className="whitespace-nowrap text-sm sm:text-[18px]">Налоги:</span>
                            <span className="flex-1 mx-3 border-b border-dotted border-[#E5E7EB]" />
                            <span className="whitespace-nowrap text-sm font-semibold sm:text-[18px]">{TAX_RATE_PERCENT}%</span>
                        </div>

                        <div className="flex items-center text-[15px] text-[#111827]">
                            <span className="whitespace-nowrap text-sm sm:text-[18px]">Доставка:</span>
                            <span className="flex-1 mx-3 border-b border-dotted border-[#E5E7EB]" />
                            <span className="whitespace-nowrap text-sm font-semibold sm:text-[18px]">{DELIVERY_FEE}₴</span>
                        </div>

                        <div className="my-[15px] h-[1px] w-full bg-[#EDEDED]" />
                    </div>

                    <div className="flex flex-col !text-[18px] gap-[25px] mt-[10px]">
                        <span className="text-[#777777]">У меня есть промокод</span>

                        <Button type="button" onClick={submit} className="h-12 rounded-[15px] text-base font-extrabold sm:h-[60px] sm:text-[18px]">
                            Оплатить {totalsum} ₴
                        </Button>
                    </div>
                </div>
            </div>
            {isPaymentModalOpen && (
                <CheckoutPaymentForm
                    total={totalsum}
                    onConfirm={onSubmit}
                    onClose={() => setIsPaymentModalOpen(false)}
                />
            )}

        </>
    );
};