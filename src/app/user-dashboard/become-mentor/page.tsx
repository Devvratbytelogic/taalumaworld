import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BecomeMentorPage } from '@/components/pages-components/user-dashboard/BecomeMentorPage';
import { isMentorRole } from '@/constants/common';
import { getMentorDashboardRoutePath } from '@/routes/routes';

export default async function UserBecomeMentorPage() {
  const role = (await cookies()).get('user_role')?.value;
  if (isMentorRole(role)) {
    redirect(getMentorDashboardRoutePath());
  }

  return <BecomeMentorPage />;
}
