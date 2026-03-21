import { ICartAPIResponse } from '@/types/user/cart';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import { IHomeAllChaptersAPIResponse } from '@/types/user/HomeAllChapters';
import { ISingleChapterAPIResponse } from '@/types/user/singleChapter';
import { IUserProfileAPIResponse } from '@/types/user/user';
import { IMyChaptersAPIResponse } from '@/types/user/myChapters';
import { IMyReadingHistoryAPIResponse } from '@/types/user/readingHistory';

export const clientSideGetApis = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** categories */
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
        /** get reading history */
        getReadingHistory: builder.query<IMyReadingHistoryAPIResponse, void>({
            query: () => ({
                url: `/user/reading-history`,
                method: 'GET',
            }),
            providesTags: ['ReadingHistory'],
        }),
    }),
});

export const {
    useGetAllChaptersQuery,
    useGetSingleChapterQuery,
    useGetCartQuery,
    useGetUserProfileQuery,
    useGetMyChaptersQuery,
    useGetReadingHistoryQuery,
} = clientSideGetApis;
