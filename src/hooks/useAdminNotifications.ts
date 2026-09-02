import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ADMIN_NOTIFICATIONS_PAGE_SIZE,
    useDeleteNotificationMutation,
    useGetAdminNotificationsQuery,
    useMarkAllNotificationsReadMutation,
    useMarkNotificationReadMutation,
} from '@/store/rtkQueries/notificationApis';
import { normalizeAdminNotifications } from '@/utils/adminNotifications';

export function useAdminNotifications() {
    const [page, setPage] = useState(1);
    const query = useGetAdminNotificationsQuery(
        { page, limit: ADMIN_NOTIFICATIONS_PAGE_SIZE },
        { refetchOnFocus: true, refetchOnReconnect: true },
    );
    const [markNotificationRead, markReadState] = useMarkNotificationReadMutation();
    const [markAllNotificationsRead, markAllState] = useMarkAllNotificationsReadMutation();
    const [deleteNotification, deleteState] = useDeleteNotificationMutation();

    const normalized = useMemo(
        () => normalizeAdminNotifications(query.data),
        [query.data],
    );

    useEffect(() => {
        if (normalized.totalPages > 0 && page > normalized.totalPages) {
            setPage(normalized.totalPages);
        }
    }, [page, normalized.totalPages]);

    const resetPage = useCallback(() => setPage(1), []);

    return {
        ...normalized,
        page,
        setPage,
        resetPage,
        pageSize: ADMIN_NOTIFICATIONS_PAGE_SIZE,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        refetch: query.refetch,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        isMarkingAll: markAllState.isLoading,
        isMarkingRead: markReadState.isLoading,
        deletingId: deleteState.originalArgs,
        isDeleting: deleteState.isLoading,
    };
}
