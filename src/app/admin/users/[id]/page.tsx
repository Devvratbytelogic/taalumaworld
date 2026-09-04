import { AdminUserDetailView } from '@/components/admin/users/AdminUserDetailView';

type Props = { params: Promise<{ id: string }> };

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params;
  return <AdminUserDetailView userId={id} />;
}
