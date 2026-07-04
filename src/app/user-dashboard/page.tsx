import { redirect } from 'next/navigation';
import { getUserDashboardProfileRoutePath } from '@/routes/routes';

export default function UserDashboardPage() {
  redirect(getUserDashboardProfileRoutePath());
}
