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
        getAllTransactions: builder.query<IAllTransactionsAPIResponse, void>({
            query: () => ({
                url: `/admin/payment-report`,
                method: 'GET',
            }),
            // providesTags: ['AdminTransactions'],
        }),
        
        getAllContactusData: builder.query<IAllContactusDataAPIResponse, void>({
            query: () => ({
                url: `/admin/all-contact-us`,
                method: 'GET',
            }),
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
} = clientSideGetApis;
