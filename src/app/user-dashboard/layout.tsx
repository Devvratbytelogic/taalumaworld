import { cookies } from 'next/headers';
import UserDashboardAppLayout from '@/components/pages-components/user-dashboard/UserDashboardLayout';

/** Dashboard is auth-specific — never statically prerender. */
export const dynamic = 'force-dynamic';

export default async function UserDashboardLayout({ children }: { children: React.ReactNode }) {
    const initialRole = (await cookies()).get('user_role')?.value;
    return <UserDashboardAppLayout initialRole={initialRole}>{children}</UserDashboardAppLayout>;
}
