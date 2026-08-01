import AdminAppLayout from '@/components/admin/layout/AdminAppLayout';

/** Admin is auth-specific — never statically prerender. */
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminAppLayout>{children}</AdminAppLayout>;
}
