
import { CheckoutCart } from "../../../../shared/components/shared/CheckoutCart";
import { Title } from "../../../../shared/components/shared/Title";

export default function CartPage() {
    return (
        <>
            <main className=" flex justify-center mt-[50px]">
                <div className="max-w-[1440px] w-full">
                     <Title text="Оформление заказа" size='lg' className="font-bold " />
                <div className="mt-[50px]">
                    <CheckoutCart />
                </div>
                
                </div>
               
            </main>

        </>
    )

}