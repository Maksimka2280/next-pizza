import { OrdersWindow } from "../OrdersPageComponents/OrderWindow"
import { Title } from "./Title"

export const OrdersPage = () => {
    return(
        <>
          <div className="px-[90px] py-[30px]">
            <Title text="Мои заказы" size="lg" className="font-black"/>
            <OrdersWindow />
          </div>
        </>
    )
}