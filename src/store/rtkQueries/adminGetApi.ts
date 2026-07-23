import { IAllCategoriesAPIResponse } from '@/types/categories';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import { IAllAuthorLeadersAPIResponse } from '@/types/authleaders';
import { IAllBooksAPIResponse } from '@/types/books';
import { IAllChaptersAPIResponse, IBlueprintsByBookIdsAPIResponse } from '@/types/chapter';
import { IGlobalSettingsAPIResponse } from '@/types/globalSettings';
import { IAllTestimonialsAPIResponse } from '@/types/testimonial';
import { IAllFaqsAPIResponse } from '@/types/faqs';
import { IAdminProfileAPIResponse } from '@/types/adminProfile';
import { IAllTransactionsAPIResponse } from '@/types/transaction';
import { IAllContactusDataAPIResponse } from '@/types/contactData';
import { IAllSubscribersAPIResponse } from '@/types/subscribers';
import { IAllOrdersAPIResponse, ISingleOrderAPIResponse } from '@/types/order';
import { ISingleChapterAPIResponse } from '@/types/singleChapter';

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
        getAllBooks: builder.query<IAllBooksAPIResponse, { page?: number; limit?: number; search?: string; category?: string; mentor_id?: string; status?: string; isMine?: boolean; isDeleted?: boolean } | void>({
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
        getChapterById: builder.query<ISingleChapterAPIResponse, string>({
            query: (id) => ({
                url: `/admin/blueprints/${id}`,
                method: 'GET',
            }),
            providesTags: ['AdminChapters'],
        }),
        /** Blueprints filtered by their parent book (series) ids, e.g. for coupon applicability pickers */
        getBlueprintsByBookIds: builder.query<IBlueprintsByBookIdsAPIResponse, { bookids: string }>({
            query: ({ bookids }) => ({
                url: `/admin/get-blueprints`,
                method: 'GET',
                params: { bookids },
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

        /** testimonials */
        getAllTestimonials: builder.query<IAllTestimonialsAPIResponse, { page?: number; limit?: number; search?: string; status?: string } | void>({
            query: (params) => ({
                url: `/admin/testimonial`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminTestimonials'],
        }),

        /** Faqs */
        getAllFaqs: builder.query<IAllFaqsAPIResponse, { page?: number; limit?: number; search?: string; status?: string } | void>({
            query: (params) => ({
                url: `/admin/faqs`,
                method: 'GET',
                params: params ? { ...params } : {},
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
                url: `/admin/contact-us`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminContactUs'],
        }),

        /** Subscribers */
        getAllSubscribers: builder.query<IAllSubscribersAPIResponse, { page?: number; limit?: number; search?: string; status?: string } | void>({
            query: (params) => ({
                url: `/admin/subscribers`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminSubscribers'],
        }),

        /** Orders (optional `type`: 'books' | 'chapter'; omit for all) */
        getAllOrders: builder.query<IAllOrdersAPIResponse, {
            type?: 'books' | 'chapter';
            page?: number;
            limit?: number;
            search?: string;
            payment_status?: string;
            fromDate?: string;
            toDate?: string;
        }>({
            query: (params) => ({
                url: `/admin/orders`,
                method: 'GET',
                params,
            }),
            providesTags: ['AdminOrders'],
        }),
        getOrderById: builder.query<ISingleOrderAPIResponse, string>({
            query: (id) => ({
                url: `/admin/orders/${id}`,
                method: 'GET',
            }),
            providesTags: ['AdminOrders'],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useGetAllAuthorLeadersQuery,
    useGetAllBooksQuery,
    useGetAllAdminChaptersQuery,
    useGetChapterByIdQuery,
    useGetBlueprintsByBookIdsQuery,
    useGetAdminGlobalSettingsQuery,
    useGetAllTestimonialsQuery,
    useGetAllFaqsQuery,
    useGetAdminProfileQuery,
    useGetAllTransactionsQuery,
    useGetAllContactusDataQuery,
    useGetAllSubscribersQuery,
    useGetAllOrdersQuery,
    useGetOrderByIdQuery,
} = clientSideGetApis;
