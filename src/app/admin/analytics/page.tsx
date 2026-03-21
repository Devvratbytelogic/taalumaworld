'use client';
import { AdminAnalyticsTab } from '@/components/admin/analytics/AdminAnalyticsTab';
import { useAppSelector } from '@/store/hooks';
import { selectContentMode } from '@/store/slices/contentModeSlice';

export default function AdminAnalyticsPage() {
    const contentMode = useAppSelector(selectContentMode);
    return <AdminAnalyticsTab contentMode={contentMode} />;
}
