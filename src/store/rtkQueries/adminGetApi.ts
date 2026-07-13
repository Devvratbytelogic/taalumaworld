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
        getAllCategories: builder.query<IAllCategoriesAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/categories`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminCategories'],
        }),

        /** Author Leaders */
        getAllAuthorLeaders: builder.query<IAllAuthorLeadersAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/leaders`,
                method: 'GET',  
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminAuthorLeaders'],
        }),

        /** Books */
        getAllBooks: builder.query<IAllBooksAPIResponse, { page?: number; limit?: number; search?: string; category?: string; leader?: string } | void>({
            query: (params) => ({
                url: `/admin/series`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminBooks'],
        }),

        /** Chapters */
        getAllAdminChapters: builder.query<IAllChaptersAPIResponse, { page?: number; limit?: number; search?: string; book_id?: string; status?: string; isDeleted?: boolean; isMine?: boolean } | void>({
            query: (params) => ({
                url: `/admin/blueprints`,
                method: 'GET',
                params: params ? { ...params } : {},
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
        getAllUsers: builder.query<IAllUsersAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/get-all-users`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminUsers'],
        }),

        /** testimonials */
        getAllTestimonials: builder.query<IAllTestimonialsAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/testimonial`,
                method: 'GET',
                params: params ? { ...params } : {},
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
        
        getAllContactusData: builder.query<IAllContactusDataAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/all-contact-us`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
        }),

        /** Subscribers */
        getAllSubscribers: builder.query<IAllSubscribersAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/all-subscriber`,
                method: 'GET',
                params: params ? { ...params } : {},
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
