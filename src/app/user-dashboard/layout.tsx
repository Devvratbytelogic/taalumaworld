import UserDashboardAppLayout from '@/components/pages-components/user-dashboard/UserDashboardLayout';

/** Dashboard is auth-specific — never statically prerender. */
export const dynamic = 'force-dynamic';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
    return <UserDashboardAppLayout>{children}</UserDashboardAppLayout>;
}
