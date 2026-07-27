import { AuditLogDetailView } from '@/components/admin/audit-log/AuditLogDetailView';

type Props = { params: Promise<{ id: string }> };

export default async function ViewAuditLogPage({ params }: Props) {
  const { id } = await params;
  return <AuditLogDetailView auditLogId={id} />;
}
