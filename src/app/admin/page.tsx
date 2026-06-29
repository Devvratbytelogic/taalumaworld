import { getAdminDashboardRoutePath } from '@/routes/routes';
import { redirect } from 'next/navigation';

export default function AdminPage() {
    redirect(getAdminDashboardRoutePath());
}
