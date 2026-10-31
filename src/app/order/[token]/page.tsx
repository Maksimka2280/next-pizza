import { OrdersPage } from "../../../../shared/components/shared/OrdersPage";

type Props = {
    params: Promise<{ token: string }>;
};

export default async function OrderPage({ params }: Props) {
    const { token } = await params;

    return <OrdersPage token={token} />;
}