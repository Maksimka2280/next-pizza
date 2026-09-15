'use client'
import { useCart } from "../../hooks/useCart"
import { CheckoutAddressForm } from "./CheckoutAdressForm"
import { CheckoutCart } from "./CheckoutCart"
import { CheckoutPayment } from "./CheckoutPayment"
import { CheckoutPersonalInfoForm } from "./CheckoutPersonalInfoForm"
import { Title } from "./Title"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { checkoutPersonalInfoSchema, type CheckoutPersonalInfoFormValues } from "../CheckOutComponents/checkoutPersonalInfoSchema"
import { toast } from "react-hot-toast"

export const Checkout = () => {
    const { cart, total,  updateItem, removeItem, clearCart } = useCart();

    const methods = useForm<CheckoutPersonalInfoFormValues>({
      resolver: zodResolver(checkoutPersonalInfoSchema),
      mode: 'onSubmit',
      defaultValues: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        comment: '',
        deliveryTime: '',
      },
    })

    const onSubmit = (values: CheckoutPersonalInfoFormValues) => {
      console.log('Checkout submit', values)
      toast.success('Данные формы отправлены')
    }

    return (
        <FormProvider {...methods}>
          <main className="flex justify-center py-[50px]">
              <div className="w-full max-w-[1440px]">
                  <Title
                      text="Оформление заказа"
                      size="lg"
                      className="font-bold"
                  />

                  <div className="mt-[50px] flex flex-wrap w-full ">
                      <div className="flex flex-col flex-1 gap-[40px]">
                          <CheckoutCart cart={cart} clearCart={clearCart} removeItem={removeItem} updateItem={updateItem}/>
                          <CheckoutPersonalInfoForm />
                          <CheckoutAddressForm />
                      </div>

                      <div className="max-w-[640px] w-full shrink-0">
                          <CheckoutPayment sum={total} onPay={methods.handleSubmit(onSubmit)} />
                      </div>
                  </div>
              </div>
          </main>
        </FormProvider>
    )
}