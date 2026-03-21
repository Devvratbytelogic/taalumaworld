import { IAllCategoriesAPIResponse } from '@/types/categories';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import { IAllAuthorLeadersAPIResponse } from '@/types/authleaders';
import { IAllBooksAPIResponse } from '@/types/books';
import { IAllChaptersAPIResponse } from '@/types/chapter';
import { IGlobalSettingsAPIResponse } from '@/types/globalSettings';
import { IAllTestimonialsAPIResponse } from '@/types/testimonial';
import { IAllUsersAPIResponse } from '@/types/allUsers';

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
        getAllChapters: builder.query<IAllChaptersAPIResponse, void>({
            query: () => ({
                url: `/admin/chapters`,
                method: 'GET',
            }),
            providesTags: ['AdminChapters'],
        }),

        /** global settings */
        getGlobalSettings: builder.query<IGlobalSettingsAPIResponse, void>({
            query: () => ({
                url: `/admin/get-global`,
                method: 'GET',
            }),
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
    }),
});

export const {
    useGetAllCategoriesQuery,
    useGetAllAuthorLeadersQuery,
    useGetAllBooksQuery,
    useGetAllChaptersQuery,
    useGetGlobalSettingsQuery,
    useGetAllUsersQuery,
    useGetAllTestimonialsQuery,
} = clientSideGetApis;
