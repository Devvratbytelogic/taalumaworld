import { InstitutionDetailView } from '@/components/admin/institutions/InstitutionDetailView';

type Props = { params: Promise<{ id: string }> };

export default async function AdminInstitutionDetailPage({ params }: Props) {
  const { id } = await params;
  return <InstitutionDetailView institutionId={id} />;
}
