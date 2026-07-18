import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EditChapterForm } from '@/components/admin/chapter/EditChapterForm';
import { AdminPage, AdminPageHeader, AdminPanel } from '@/components/admin/layout/AdminContent';
import { getMentorChaptersRoutePath } from '@/routes/routes';

type Props = { params: Promise<{ id: string }> };

export default async function MentorEditChapterPage({ params }: Props) {
  const { id } = await params;

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
        title="Edit blueprint"
        description="Update blueprint content, metadata, and attachments."
      />

      <AdminPanel className="p-6 md:p-7" padding={false}>
        <EditChapterForm chapterId={id} />
      </AdminPanel>
    </AdminPage>
  );
}
