import moment from 'moment';
import type { LucideIcon } from 'lucide-react';
import {
    Bell,
    ClipboardList,
    Flag,
    GraduationCap,
    ShoppingBag,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    Wallet,
    ShieldCheck,
} from 'lucide-react';
import type {
    AdminNotificationItem,
    IAdminNotificationsAPIResponse,
} from '@/types/notification';

export function formatNotificationTime(iso?: string | null): string {
    if (!iso) return '';
    const parsed = moment(iso);
    return parsed.isValid() ? parsed.fromNow() : '';
}

/** Use the API `link` as-is, keeping only path/query/hash so we stay on this origin. */
export function hrefFromApiLink(link?: string | null): string | null {
    if (!link?.trim()) return null;
    const value = link.trim();
    if (value.startsWith('/')) return value;
    try {
        const url = new URL(value);
        return `${url.pathname}${url.search}${url.hash}` || null;
    } catch {
        return value;
    }
}

export function getNotificationTypeStyle(type: string): { icon: LucideIcon; className: string } {
    const value = type.toLowerCase();
    if (value.includes('flag')) {
        return { icon: Flag, className: 'bg-orange-50 text-orange-600' };
    }
    if (value.includes('score') || value.includes('ai')) {
        return { icon: Sparkles, className: 'bg-rose-50 text-rose-600' };
    }
    if (value.includes('verif')) {
        return { icon: ShieldCheck, className: 'bg-violet-50 text-violet-600' };
    }
    if (value.includes('tier') || value.includes('upgrade')) {
        return { icon: TrendingUp, className: 'bg-amber-50 text-amber-600' };
    }
    if (value.includes('application')) {
        return { icon: ClipboardList, className: 'bg-sky-50 text-sky-600' };
    }
    if (value.includes('mentor') || value.includes('register') || value.includes('author')) {
        return { icon: GraduationCap, className: 'bg-emerald-50 text-emerald-600' };
    }
    if (value.includes('order') || value.includes('sale') || value.includes('purchase')) {
        return { icon: ShoppingBag, className: 'bg-indigo-50 text-indigo-600' };
    }
    if (value.includes('review')) {
        return { icon: Star, className: 'bg-yellow-50 text-yellow-600' };
    }
    if (value.includes('follow')) {
        return { icon: Users, className: 'bg-teal-50 text-teal-600' };
    }
    if (value.includes('payout') || value.includes('wallet') || value.includes('withdraw')) {
        return { icon: Wallet, className: 'bg-cyan-50 text-cyan-600' };
    }
    return { icon: Bell, className: 'bg-slate-100 text-slate-600' };
}

export function normalizeAdminNotifications(
    response: IAdminNotificationsAPIResponse | undefined,
): {
    items: AdminNotificationItem[];
    unreadCount: number;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
} {
    const payload = response?.data;
    const rawItems = (payload?.data ?? []).filter((item) => !item.is_deleted);

    const items = rawItems.map((item) => ({
        id: item._id,
        title: item.title || 'Notification',
        description: item.msg || '',
        type: item.type || '',
        isRead: Boolean(item.is_read),
        href: hrefFromApiLink(item.link),
        createdAt: item.createdAt || null,
    }));

    return {
        items,
        unreadCount: payload?.unread_count ?? items.filter((item) => !item.isRead).length,
        total: payload?.total ?? items.length,
        page: payload?.page ?? 1,
        limit: payload?.limit ?? items.length,
        totalPages: payload?.totalPages ?? 1,
    };
}
