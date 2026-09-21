import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AgreementForm } from '@/components/admin/agreements/AgreementForm';
import { AdminPage, AdminPageHeader, AdminPanel } from '@/components/admin/layout/AdminContent';
import { getAdminSectionRoutePath } from '@/routes/routes';

export default function CreateAgreementPage() {
  return (
    <AdminPage>
      <Link
        href={getAdminSectionRoutePath('agreements')}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to agreements
      </Link>

      <AdminPageHeader
        eyebrow="Legal"
        title="Add agreement"
        description="Configure the legal document content and version lineage."
      />

      <AdminPanel className="p-6 md:p-7" padding={false}>
        <AgreementForm />
      </AdminPanel>
    </AdminPage>
  );
}
