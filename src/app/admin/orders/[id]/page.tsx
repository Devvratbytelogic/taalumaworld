import { OrderDetailView } from '@/components/admin/order/OrderDetailView';

type Props = { params: Promise<{ id: string }> };

export default async function ViewOrderPage({ params }: Props) {
  const { id } = await params;

  return <OrderDetailView orderId={id} />;
}
