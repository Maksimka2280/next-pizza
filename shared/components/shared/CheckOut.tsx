'use client'
import { useCart } from "../../hooks/useCart"
import { CheckoutAddressForm } from "./CheckoutAdressForm"
import { CheckoutCart } from "./CheckoutCart"
import { CheckoutPayment } from "./CheckoutPayment"
import { CheckoutPersonalInfoForm } from "./CheckoutPersonalInfoForm"
import { CheckoutSkeleton } from "./CheckoutSkeleton"
import { Title } from "./Title"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { checkoutPersonalInfoSchema, type CheckoutPersonalInfoFormValues } from "../CheckOutComponents/CheckoutValidate"
import { getOrCreateGuestCartToken } from "../../lib/guestCart"
import { guestId } from "../../lib/guestId"
import { createOrder } from "../../service/orders"

export const Checkout = () => {
    const { cart, total, updateItem, removeItem, clearCart, loading } = useCart();

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

    if (loading) {
      return (
        <FormProvider {...methods}>
          <CheckoutSkeleton />
        </FormProvider>
      );
    }

      const onSubmit = async (values: CheckoutPersonalInfoFormValues, totalAmount: number) => {
      if (!cart?.items.length) {
      throw new Error("Нельзя оформить заказ с пустой корзиной")
      }

      const token = cart.token ?? getOrCreateGuestCartToken() ?? guestId()
      if (!token) {
       throw new Error("Не удалось получить токен гостевой корзины")
      }

      await createOrder({
        token,
        userId: null,
        totalAmount,
        items: cart.items,
        fullName: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        phone: values.phone,
        address: values.address,
        comment: values.comment || null,
      })
    }

    const handlePayment = async (totalAmount: number) => {
      let isValid = false
      await methods.handleSubmit(async (values) => {
        await onSubmit(values, totalAmount)
        isValid = true
      })()
      return isValid
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
                          <CheckoutPayment sum={total} onPay={handlePayment} />
                      </div>
                  </div>
              </div>
          </main>
        </FormProvider>
    )
}