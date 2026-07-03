import { AdminPage, AdminPageHeader } from '@/components/admin/layout/AdminContent';

export default function MentorDashboardPage() {
  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Overview"
        title="Mentor dashboard"
        description="Overview of sales, revenue, and blueprint performance."
      />
    </AdminPage>
  );
}
