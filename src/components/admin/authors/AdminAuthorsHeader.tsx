import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

export function AdminAuthorsHeader({ onCreateAuthor: _onCreateAuthor }: { onCreateAuthor?: () => void }) {
  return (
    <AdminPageHeader
      title="Mentor management"
      description="Review and manage mentors on the platform"
    />
  );
}
