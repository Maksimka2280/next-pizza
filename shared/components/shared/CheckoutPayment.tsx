import { Button } from "../ui/button";

type Props = {
    sum: number;
    onPay: () => void;
};

export const CheckoutPayment = ({ sum, onPay }: Props) => {

    const delivery = 120;
    const tax = 5;
    const totalsum = sum + delivery + (sum * tax) / 100;
    return (
        <>
            <div className="w-full h-[490px] rounded-[30px] bg-[#FFFFFF] p-[40px]">
                <div>
                    <div className="flex flex-col ">
                        <div>
                            <span className="text-[22px]">Итого:</span>
                            <h1 className="text-[34px] font-black">{totalsum} ₴</h1>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 ">
                        <div className="my-[15px] h-[1px] w-full bg-[#EDEDED]" />
                        <div className="flex items-center text-[15px] text-[#111827]">
                            <span className="whitespace-nowrap text-[18px]">Стоимость товаров:</span>
                            <span className="flex-1 mx-3 border-b border-dotted border-[#E5E7EB]" />
                            <span className="font-semibold text-[18px]"> {sum} ₴</span>
                        </div>

                        <div className="flex items-center text-[15px] text-[#111827]">
                            <span className="whitespace-nowrap text-[18px]">Налоги:</span>
                            <span className="flex-1 mx-3 border-b border-dotted border-[#E5E7EB]" />
                            <span className="font-semibold text-[18px]">{tax}%</span>
                        </div>

                        <div className="flex items-center text-[15px] text-[#111827]">
                            <span className="whitespace-nowrap text-[18px]">Доставка:</span>
                            <span className="flex-1 mx-3 border-b border-dotted border-[#E5E7EB]" />
                            <span className="font-semibold text-[18px]">{delivery}₴</span>

                        </div>

                        <div className="my-[15px] h-[1px] w-full bg-[#EDEDED]" />
                    </div>
                    <div className="flex flex-col !text-[18px] gap-[25px] mt-[10px]">
                        <span className="text-[#777777] ">У меня есть промокод</span>
                        <Button type="button" onClick={onPay} className='rounded-[15px] h-[60px] text-[18px] font-extrabold'>Перейти к оплате</Button>
                    </div>
                </div>
            </div>
        </>
    );
};