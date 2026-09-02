import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type {
    IAdminNotificationsAPIResponse,
    IAdminNotificationsQueryParams,
} from '@/types/notification';

export const ADMIN_NOTIFICATIONS_PAGE_SIZE = 10;

export const notificationApis = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** Portal list + unread count (admin / mentor / staff). Not /user/notifications. */
        getAdminNotifications: builder.query<IAdminNotificationsAPIResponse, IAdminNotificationsQueryParams>({
            query: (params) => ({
                url: `/admin/notifications`,
                method: 'GET',
                params,
            }),
            providesTags: ['AdminNotifications'],
        }),
        markNotificationRead: builder.mutation<unknown, string>({
            query: (id) => ({
                url: `/admin/notifications/${id}/read`,
                method: 'PUT',
            }),
            invalidatesTags: ['AdminNotifications'],
        }),
        markAllNotificationsRead: builder.mutation<unknown, void>({
            query: () => ({
                url: `/admin/notifications/read-all`,
                method: 'PUT',
            }),
            invalidatesTags: ['AdminNotifications'],
        }),
        /** Hard delete — not a soft delete. */
        deleteNotification: builder.mutation<unknown, string>({
            query: (id) => ({
                url: `/admin/notifications/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminNotifications'],
        }),
    }),
});

export const {
    useGetAdminNotificationsQuery,
    useMarkNotificationReadMutation,
    useMarkAllNotificationsReadMutation,
    useDeleteNotificationMutation,
} = notificationApis;
