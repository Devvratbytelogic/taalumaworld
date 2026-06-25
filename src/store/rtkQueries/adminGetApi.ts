import { IAllCategoriesAPIResponse } from '@/types/categories';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import { IAllAuthorLeadersAPIResponse } from '@/types/authleaders';
import { IAllBooksAPIResponse } from '@/types/books';
import { IAllChaptersAPIResponse } from '@/types/chapter';
import { IGlobalSettingsAPIResponse } from '@/types/globalSettings';
import { IAllTestimonialsAPIResponse } from '@/types/testimonial';
import { IAllUsersAPIResponse } from '@/types/allUsers';
import { IAllFaqsAPIResponse } from '@/types/faqs';
import { IAdminProfileAPIResponse } from '@/types/adminProfile';
import { IAllTransactionsAPIResponse } from '@/types/transaction';
import { IAllContactusDataAPIResponse } from '@/types/contactData';
import { IAllSubscribersAPIResponse } from '@/types/subscribers';
import { IAllOrdersAPIResponse } from '@/types/order';

export const clientSideGetApis = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** categories */
        getAllCategories: builder.query<IAllCategoriesAPIResponse, void>({
            query: () => ({
                url: `/admin/categories`,
                method: 'GET',
            }),
            providesTags: ['AdminCategories'],
        }),

        /** Author Leaders */
        getAllAuthorLeaders: builder.query<IAllAuthorLeadersAPIResponse, void>({
            query: () => ({
                url: `/admin/leaders`,
                method: 'GET',
            }),
            providesTags: ['AdminAuthorLeaders'],
        }),

        /** Books */
        getAllBooks: builder.query<IAllBooksAPIResponse, void>({
            query: () => ({
                url: `/admin/books`,
                method: 'GET',
            }),
            providesTags: ['AdminBooks'],
        }),

        /** Chapters */
        getAllAdminChapters: builder.query<IAllChaptersAPIResponse, void>({
            query: () => ({
                url: `/admin/chapters`,
                method: 'GET',
            }),
            providesTags: ['AdminChapters'],
        }),

        /** global settings */
        getAdminGlobalSettings: builder.query<IGlobalSettingsAPIResponse, void>({
            query: () => ({
                url: `/admin/get-global`,
                method: 'GET',
            }),
            providesTags: ['GlobalSettings'],
        }),

        /** users */
        getAllUsers: builder.query<IAllUsersAPIResponse, void>({
            query: () => ({
                url: `/admin/get-all-users`,
                method: 'GET',
            }),
            providesTags: ['AdminUsers'],
        }),

        /** testimonials */
        getAllTestimonials: builder.query<IAllTestimonialsAPIResponse, void>({
            query: () => ({
                url: `/admin/testimonial`,
                method: 'GET',
            }),
            providesTags: ['AdminTestimonials'],
        }),

        /** Faqs */
        getAllFaqs: builder.query<IAllFaqsAPIResponse, void>({
            query: () => ({
                url: `/admin/faqs`,
                method: 'GET',
            }),
            providesTags: ['AdminFAQs'],
        }),

        /** Admin Profile */
        getAdminProfile: builder.query<IAdminProfileAPIResponse, void>({
            query: () => ({
                url: `/admin/get-profile`,
                method: 'GET',
            }),
            providesTags: ['AdminProfile'],
        }),

        /** Transactions */
        getAllTransactions: builder.query<IAllTransactionsAPIResponse, { search?: string, fromDate?: string, toDate?: string, status?: string, page?: number, limit?: number }>({
            query: (params) => ({
                url: `/admin/payment-report`,
                method: 'GET',
                params: params,
            }),
            // providesTags: ['AdminTransactions'],
        }),
        
        getAllContactusData: builder.query<IAllContactusDataAPIResponse, void>({
            query: () => ({
                url: `/admin/all-contact-us`,
                method: 'GET',
            }),
        }),

        /** Subscribers */
        getAllSubscribers: builder.query<IAllSubscribersAPIResponse, void>({
            query: () => ({
                url: `/admin/all-subscriber`,
                method: 'GET',
            }),
            providesTags: ['AdminSubscribers'],
        }),

        /** Book Orders */
        getAllBookOrders: builder.query<IAllOrdersAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/orders`,
                method: 'GET',
                params: { type: 'books', ...(params || {}) },
            }),
            providesTags: ['AdminBookOrders'],
        }),

        /** Blueprint Orders */
        getAllBlueprintOrders: builder.query<IAllOrdersAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/orders`,
                method: 'GET',
                params: { type: 'chapters', ...(params || {}) },
            }),
            providesTags: ['AdminBlueprintOrders'],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useGetAllAuthorLeadersQuery,
    useGetAllBooksQuery,
    useGetAllAdminChaptersQuery,
    useGetAdminGlobalSettingsQuery,
    useGetAllUsersQuery,
    useGetAllTestimonialsQuery,
    useGetAllFaqsQuery,
    useGetAdminProfileQuery,
    useGetAllTransactionsQuery,
    useGetAllContactusDataQuery,
    useGetAllSubscribersQuery,
    useGetAllBookOrdersQuery,
    useGetAllBlueprintOrdersQuery,
} = clientSideGetApis;
