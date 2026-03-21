'use client';
import { AdminDashboardTab } from '@/components/admin/dashboard/AdminDashboardTab';
import { useAdminUser } from '@/hooks/useAdminUser';
import { useAppSelector } from '@/store/hooks';
import { selectContentMode } from '@/store/slices/contentModeSlice';

export default function AdminDashboardPage() {
    const { adminUser } = useAdminUser();
    const contentMode = useAppSelector(selectContentMode);

    if (!adminUser) return null;
    return <AdminDashboardTab contentMode={contentMode} adminUser={adminUser} />;
}
