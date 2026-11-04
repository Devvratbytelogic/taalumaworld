import { CouponRedemptionsView } from '@/components/admin/coupons/CouponRedemptionsView';

type Props = { params: Promise<{ id: string }> };

export default async function AdminCouponRedemptionsPage({ params }: Props) {
  const { id } = await params;
  return <CouponRedemptionsView couponId={decodeURIComponent(id)} />;
}
