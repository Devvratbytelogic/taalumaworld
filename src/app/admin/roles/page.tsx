'use client';
import { AdminRolesTab } from '@/components/admin/roles-premissions/AdminRolesTab';
import { useAdminUser } from '@/hooks/useAdminUser';

export default function AdminRolesPage() {
    const { adminUser } = useAdminUser();

    if (!adminUser) return null;
    return <AdminRolesTab adminUser={adminUser} />;
}
