import { ICartAPIResponse } from '@/types/user/cart';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import { IHomeAllChaptersAPIResponse } from '@/types/user/HomeAllChapters';
import { ISingleChapterAPIResponse } from '@/types/user/singleChapter';
import { IUserProfileAPIResponse } from '@/types/user/user';
import { IMyChaptersAPIResponse } from '@/types/user/myChapters';
import { IMyBooksAPIResponse } from '@/types/user/myBooks';
import { IMyReadingHistoryAPIResponse } from '@/types/user/readingHistory';
import { IFAQAPIResponse, ITestimonialsAPIResponse } from '@/types/user/testimonial';
import { IGlobalSettingsAPIResponse } from '@/types/globalSettings';
import { ISingleBookAPIResponse } from '@/types/user/singleBook';
import { ISearchResultsAPIResponse } from '@/types/user/saech';
import { IUserAllCategoriesAPIResponse } from '@/types/user/allCategory';
import { IUserAllAuthorsAPIResponse } from '@/types/user/allAuthors';
import { IUserAllTagsAPIResponse } from '@/types/user/allTags';
import { IActiveReadersAPIResponse } from '@/types/activeReaders';

export interface IGetAllChaptersParams {
    categoryId?: string | null;
    thoughtLeaderId?: string | null;
    tags?: string | null;
    readingProgress?: string | null;
}

export const clientSideGetApis = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** get global settings */
        getGlobalSettings: builder.query<IGlobalSettingsAPIResponse, void>({
            query: () => ({
                url: `/user/get-global`,
                method: 'GET',
            }),
            providesTags: ['GlobalSettings'],
        }),
        /** get active readers */
        getActiveReaders: builder.query<IActiveReadersAPIResponse, void>({
            query: () => ({
                url: `/user/active-readers`,
                method: 'GET',
            }),
        }),
        /** chapters */
        getAllChapters: builder.query<IHomeAllChaptersAPIResponse, IGetAllChaptersParams>({
            query: (params) => ({
                url: `/user/content`,
                method: 'GET',
                params,
            }),
            providesTags: ['AllChapters'],
        }),
        /** single chapter */
        getSingleChapter: builder.query<ISingleChapterAPIResponse, string>({
            query: (id) => ({
                url: `/user/content/chapter/${id}`,
                method: 'GET',
            }),
            providesTags: (_, __, id) => [{ type: 'SingleChapter', id }],
        }),
        /** single book */
        getSingleBook: builder.query<ISingleBookAPIResponse, string>({
            query: (id) => ({
                url: `/user/content/book/${id}`,
                method: 'GET',
            }),
            providesTags: (_, __, id) => [{ type: 'SingleChapter', id }],
        }),
        getUserAllCategories: builder.query<IUserAllCategoriesAPIResponse, void>({
            query: () => ({
                url: `/user/categories`,
                method: 'GET',
            }),
        }),
        /** get all authors */
        getUserAllAuthors: builder.query<IUserAllAuthorsAPIResponse, void>({
            query: () => ({
                url: `/user/authors`,
                method: 'GET',
            }),
        }),
        /** get all tags */
        getAllTags: builder.query<IUserAllTagsAPIResponse, void>({
            query: () => ({
                url: `/user/tags`,
                method: 'GET',
            }),
        }),
        /** get cart */
        getCart: builder.query<ICartAPIResponse, void>({
            query: () => ({
                url: `/user/get-cart`,
                method: 'GET',
            }),
            providesTags: ['Cart'],
        }),
        /** get user profile */
        getUserProfile: builder.query<IUserProfileAPIResponse, void>({
            query: () => ({
                url: `/user/get-user-profile`,
                method: 'GET',
            }),
            providesTags: ['UserProfile'],
        }),
        /** get my chapters */
        getMyChapters: builder.query<IMyChaptersAPIResponse, void>({
            query: () => ({
                url: `/user/my-chapters`,
                method: 'GET',
            }),
            providesTags: ['MyChapters'],
        }),
        /** get my books */
        getMyBooks: builder.query<IMyBooksAPIResponse, void>({
            query: () => ({
                url: `/user/my-books`,
                method: 'GET',
            }),
            providesTags: ['MyChapters'],
        }),
        /** get reading history */
        getReadingHistory: builder.query<IMyReadingHistoryAPIResponse, void>({
            query: () => ({
                url: `/user/reading-history`,
                method: 'GET',
            }),
            providesTags: ['ReadingHistory'],
        }),
        /** get testimonials */
        getTestimonials: builder.query<ITestimonialsAPIResponse, void>({
            query: () => ({
                url: `/user/testimonial`,
                method: 'GET',
            }),
        }),
        /** get FAQs */
        getFAQ: builder.query<IFAQAPIResponse, { type?: string } | void>({
            query: (params) => ({
                url: `/user/faqs`,
                method: 'GET',
                params: params && (params as { type?: string }).type
                    ? { type: (params as { type?: string }).type }
                    : undefined,
            }),
        }),
        /** get search results */
        getSearchResults: builder.query<ISearchResultsAPIResponse, string>({
            query: (query) => ({
                url: `/user/content/search`,
                method: 'GET',
                params: { query },
            }),
        }),
        getTransactionInvoice: builder.query<Blob, { orderId: string }>({
            query: ({ orderId }) => ({
                url: `/user/invoice/${orderId}`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
            }),
        }),
    }),
});

export const {
    useGetGlobalSettingsQuery,
    useGetActiveReadersQuery,
    useGetAllChaptersQuery,
    useGetSingleChapterQuery,
    useLazyGetSingleChapterQuery,
    useGetSingleBookQuery,
    useGetUserAllCategoriesQuery,
    useGetUserAllAuthorsQuery,
    useGetAllTagsQuery,
    useGetCartQuery,
    useGetUserProfileQuery,
    useGetMyChaptersQuery,
    useGetMyBooksQuery,
    useGetReadingHistoryQuery,
    useGetTestimonialsQuery,
    useGetFAQQuery,
    useGetSearchResultsQuery,
    useLazyGetTransactionInvoiceQuery,
} = clientSideGetApis;
