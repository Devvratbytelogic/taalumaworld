import MyBlueprintReader from '@/components/pages-components/user-dashboard/MyBlueprintReader';

type Props = { params: Promise<{ slug: string }> };

export default async function UserPurchasedBlueprintPage({ params }: Props) {
  const { slug } = await params;
  return <MyBlueprintReader slug={slug} />;
}
