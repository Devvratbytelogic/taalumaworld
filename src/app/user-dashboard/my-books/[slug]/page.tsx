import { MyPurchasedSeriesPage } from '@/components/pages-components/user-dashboard/MyPurchasedSeriesPage';
import { notFoundWhenSeriesHidden } from '@/app/series/requireSeriesVisible';

type Props = { params: Promise<{ slug: string }> };

export default async function UserPurchasedSeriesPage({ params }: Props) {
  await notFoundWhenSeriesHidden();
  const { slug } = await params;
  return <MyPurchasedSeriesPage slug={slug} />;
}
