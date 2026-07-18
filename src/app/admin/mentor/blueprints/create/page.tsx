import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CreateChapterForm } from '@/components/admin/chapter/CreateChapterForm';
import { AdminPage, AdminPageHeader, AdminPanel } from '@/components/admin/layout/AdminContent';
import { getMentorChaptersRoutePath } from '@/routes/routes';

export default function MentorCreateChapterPage() {
  return (
    <AdminPage>
      <Link
        href={getMentorChaptersRoutePath()}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blueprints
      </Link>

      <AdminPageHeader
        title="Create new blueprint"
        description="Add blueprint content, metadata, and an optional PDF attachment."
      />

      <AdminPanel className="p-6 md:p-7" padding={false}>
        <CreateChapterForm />
      </AdminPanel>
    </AdminPage>
  );
}
