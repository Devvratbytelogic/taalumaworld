'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, BellOff, CheckCheck, ChevronLeft, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/components/ui/utils';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import toast from '@/utils/toast';
import { formatNotificationTime, getNotificationTypeStyle } from '@/utils/adminNotifications';
import type { AdminNotificationItem } from '@/types/notification';

export function AdminNotificationBell() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const {
        items,
        unreadCount,
        total,
        totalPages,
        page,
        setPage,
        resetPage,
        isLoading,
        isFetching,
        isError,
        refetch,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        isMarkingAll,
        isDeleting,
        deletingId,
    } = useAdminNotifications();

    const badgeLabel = unreadCount > 99 ? '99+' : String(unreadCount);
    const showPagination = totalPages > 1;

    const openHref = (href: string | null) => {
        if (!href) return;
        router.push(href);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (nextOpen) {
            void refetch();
        } else {
            resetPage();
        }
    };

    const handleOpenItem = async (item: AdminNotificationItem) => {
        if (!item.isRead) {
            try {
                await markNotificationRead(item.id).unwrap();
            } catch (error) {
                console.error('Failed to mark notification as read', error);
            }
        }
        setOpen(false);
        resetPage();
        openHref(item.href);
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead(undefined).unwrap();
            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Failed to mark all notifications as read', error);
        }
    };

    const handleDelete = async (item: AdminNotificationItem) => {
        try {
            await deleteNotification(item.id).unwrap();
            toast.success('Notification removed');
        } catch (error) {
            console.error('Failed to delete notification', error);
        }
    };

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 data-[state=open]:border-primary/30 data-[state=open]:bg-primary/5"
                    aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
                >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 ? (
                        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold leading-none text-white">
                            {badgeLabel}
                        </span>
                    ) : null}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-90 overflow-hidden rounded-md border-slate-200 p-0 shadow-lg">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Notifications</p>
                        <p className="text-xs text-slate-500">
                            {unreadCount > 0
                                ? `${unreadCount} unread`
                                : 'You are up to date'}
                        </p>
                    </div>
                    {unreadCount > 0 ? (
                        <button
                            type="button"
                            onClick={handleMarkAllRead}
                            disabled={isMarkingAll}
                            className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isMarkingAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5" />}
                            Mark all read
                        </button>
                    ) : null}
                </div>

                <div className="custom_scrollbar relative max-h-[min(28rem,70vh)] overflow-y-auto">
                    {isFetching && items.length > 0 ? (
                        <div className="pointer-events-none absolute right-3 top-2 z-10">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                        </div>
                    ) : null}
                    {isLoading && items.length === 0 ? (
                        <div className="space-y-3 p-4">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="flex animate-pulse items-start gap-3">
                                    <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-100" />
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-3.5 w-3/4 rounded bg-slate-100" />
                                        <div className="h-3 w-1/2 rounded bg-slate-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : isError && items.length === 0 ? (
                        <div className="flex flex-col items-center px-6 py-10 text-center">
                            <p className="text-sm font-medium text-slate-900">Couldn&apos;t load notifications</p>
                            <p className="mt-1 text-xs text-slate-500">Please try again in a moment.</p>
                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="mt-3 text-xs font-medium text-primary hover:underline"
                            >
                                Retry
                            </button>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center px-6 py-10 text-center">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                <BellOff className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-medium text-slate-900">You&apos;re all caught up</p>
                            <p className="mt-1 text-xs text-slate-500">No notifications right now.</p>
                        </div>
                    ) : (
                        items.map((item) => {
                            const { icon: Icon, className } = getNotificationTypeStyle(item.type);
                            const deleting = isDeleting && deletingId === item.id;
                            return (
                                <div
                                    key={item.id}
                                    className={cn(
                                        'flex items-start gap-1 border-b border-slate-100 last:border-b-0',
                                        !item.isRead && 'bg-primary/5',
                                    )}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleOpenItem(item)}
                                        className="flex min-w-0 flex-1 items-start gap-3 px-3 py-2.5 text-left hover:bg-slate-50"
                                    >
                                        <span className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', className)}>
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="flex items-start gap-2">
                                                <span className="truncate text-sm font-medium text-slate-900">{item.title}</span>
                                                {!item.isRead ? (
                                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                                ) : null}
                                            </span>
                                            {item.description ? (
                                                <span className="mt-0.5 line-clamp-2 block text-xs text-slate-500">{item.description}</span>
                                            ) : null}
                                            {item.createdAt ? (
                                                <span className="mt-0.5 block text-[11px] text-slate-400">
                                                    {formatNotificationTime(item.createdAt)}
                                                </span>
                                            ) : null}
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Delete notification"
                                        disabled={deleting}
                                        onClick={() => handleDelete(item)}
                                        className="mt-2 mr-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                                    >
                                        {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {showPagination ? (
                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-3 py-2">
                        <p className="text-[11px] text-slate-500">
                            Page {page} of {totalPages}
                            <span className="ml-1 text-slate-400">({total})</span>
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={page <= 1 || isFetching}
                                onClick={() => setPage(Math.max(1, page - 1))}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                disabled={page >= totalPages || isFetching}
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Next page"
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                ) : null}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
