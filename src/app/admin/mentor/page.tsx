import { getMentorDashboardRoutePath } from '@/routes/routes';
import { redirect } from 'next/navigation';

export default function MentorPage() {
    redirect(getMentorDashboardRoutePath());
}
