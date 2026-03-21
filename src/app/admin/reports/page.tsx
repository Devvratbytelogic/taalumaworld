'use client';
import { AdminReportsTab } from '@/components/admin/reports/AdminReportsTab';
import { useAppSelector } from '@/store/hooks';
import { selectContentMode } from '@/store/slices/contentModeSlice';

export default function AdminReportsPage() {
    const contentMode = useAppSelector(selectContentMode);
    return <AdminReportsTab contentMode={contentMode} />;
}
