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
import { createOrder } from "../../service/orders"

export const Checkout = () => {
  const { cart, total, updateItem, removeItem, clearCart, loading } = useCart();
  const methods = useForm<CheckoutPersonalInfoFormValues>({
    resolver: zodResolver(checkoutPersonalInfoSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
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

  const onSubmit = async (
    values: CheckoutPersonalInfoFormValues,
    totalAmount: number
  ) => {
    if (!cart?.items.length) {
      throw new Error("Нельзя оформить заказ с пустой корзиной");
    }

    const result = await createOrder({
      totalAmount,
      items: cart.items,
      fullName: `${values.firstName} ${values.lastName}`.trim(),
      email: values.email,
      phone: values.phone,
      address: values.address,
      comment: values.comment || null,
    });
    return result;
  };


  const validateOrder = async () => {
    const isValid = await methods.trigger();
    return isValid;
  };

  const submitOrder = async () => {
    const values = methods.getValues();
    const result = await onSubmit(values, total);
    return result;
  };

  return (
    <FormProvider {...methods}>
      <main className="flex justify-center px-3 py-6 sm:px-5 sm:py-10 lg:px-8 lg:py-[50px]">
        <div className="w-full max-w-[1440px]">
          <div className="flex items-center gap-3 pb-6 sm:pb-8 lg:pb-[45px]">
            <span className="block h-8 w-[6px] shrink-0 rounded-full bg-[#FE5F00] sm:h-[40px] sm:w-[7px]" />
            <Title text="Оформление заказа" size="lg" className="font-black" />
          </div>

          <div className="mt-6 grid w-full grid-cols-1 items-start gap-6 lg:mt-[50px] lg:grid-cols-[minmax(0,1fr)_minmax(360px,640px)] lg:gap-8">
            <div className="flex min-w-0 flex-col gap-6 sm:gap-8 lg:gap-[40px]">
              <CheckoutCart cart={cart} clearCart={clearCart} removeItem={removeItem} updateItem={updateItem} />
              <CheckoutPersonalInfoForm />
              <CheckoutAddressForm />
            </div>

            <div className="w-full min-w-0">
              <CheckoutPayment sum={total} validateOrder={validateOrder} onSubmit={submitOrder} />
            </div>
          </div>
        </div>
      </main>
    </FormProvider>
  )
}