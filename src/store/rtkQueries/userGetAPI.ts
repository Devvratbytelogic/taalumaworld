import { ICartAPIResponse } from '@/types/user/cart';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import { IHomeAllChaptersAPIResponse } from '@/types/user/HomeAllChapters';
import { ISingleChapterAPIResponse } from '@/types/user/singleChapter';

export const clientSideGetApis = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** categories */
        getAllChapters: builder.query<IHomeAllChaptersAPIResponse, void>({
            query: () => ({
                url: `/user/content`,
                method: 'GET',
            }),
        }),
        /** single chapter */
        getSingleChapter: builder.query<ISingleChapterAPIResponse, string>({
            query: (id) => ({
                url: `/user/content/chapter/${id}`,
                method: 'GET',
            }),
        }),
        /** get cart */
        getCart: builder.query<ICartAPIResponse, void>({
            query: () => ({
                url: `/user/get-cart`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetAllChaptersQuery,
    useGetSingleChapterQuery,
    useGetCartQuery,
} = clientSideGetApis;
