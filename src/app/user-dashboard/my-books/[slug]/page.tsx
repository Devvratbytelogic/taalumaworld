import { MyPurchasedSeriesPage } from '@/components/pages-components/user-dashboard/MyPurchasedSeriesPage';

type Props = { params: Promise<{ slug: string }> };

export default async function UserPurchasedSeriesPage({ params }: Props) {
  const { slug } = await params;
  return <MyPurchasedSeriesPage slug={slug} />;
}
