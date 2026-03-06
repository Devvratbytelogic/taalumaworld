import { IAllCategoriesAPIResponse } from '@/types/categories';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import { IAllAuthorLeadersAPIResponse } from '@/types/authleaders';
import { IAllBooksAPIResponse } from '@/types/books';
import { IAllChaptersAPIResponse } from '@/types/chapter';

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
    }),
});

export const {
    useGetAllCategoriesQuery,
    useGetAllAuthorLeadersQuery,
    useGetAllBooksQuery,
    useGetAllChaptersQuery,
} = clientSideGetApis;
