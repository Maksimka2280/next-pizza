import { OrdersWindow } from "../OrdersPageComponents/OrderWindow"
import { Title } from "./Title"

export const OrdersPage = () => {
  return (
    <>
      <main className="flex justify-center items-center pt-[40px] ">
        <div className="w-full max-w-[1440px]">
          <div className="flex items-center gap-[12px]">
            <span className="block h-[40px] w-[7px] rounded-full bg-[#FE5F00]" />
            <Title text="Мои заказы" size="lg" className="font-black" />
          </div>
          <OrdersWindow />
        </div>
      </main>

    </>
  )
}