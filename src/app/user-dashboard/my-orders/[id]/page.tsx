import { MyOrderDetailPage } from '@/components/pages-components/user-dashboard/MyOrderDetailPage';

type Props = { params: Promise<{ id: string }> };

export default async function UserMyOrderDetailPage({ params }: Props) {
  const { id } = await params;

  return <MyOrderDetailPage orderId={id} />;
}
