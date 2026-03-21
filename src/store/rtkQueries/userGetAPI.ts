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
        /** chapters */
        getAllChapters: builder.query<IHomeAllChaptersAPIResponse, void>({
            query: () => ({
                url: `/user/content`,
                method: 'GET',
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
        getSingleBook: builder.query<ISingleBookAPIResponse, string>({
            query: (id) => ({
                url: `/user/content/book/${id}`,
                method: 'GET',
            }),
            providesTags: (_, __, id) => [{ type: 'SingleChapter', id }],
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
        getFAQ: builder.query<IFAQAPIResponse, void>({
            query: () => ({
                url: `/user/faqs`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetGlobalSettingsQuery,
    useGetAllChaptersQuery,
    useGetSingleChapterQuery,
    useGetSingleBookQuery,
    useGetCartQuery,
    useGetUserProfileQuery,
    useGetMyChaptersQuery,
    useGetMyBooksQuery,
    useGetReadingHistoryQuery,
    useGetTestimonialsQuery,
    useGetFAQQuery,
} = clientSideGetApis;
