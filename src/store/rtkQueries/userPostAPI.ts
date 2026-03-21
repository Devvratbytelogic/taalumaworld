import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const clientSidePostApis = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        addChapterToCart: builder.mutation({
            query: (body) => ({
                url: `/user/add-cart`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Cart'],
        }),
        removeCartItem: builder.mutation<void, string>({
            query: (cartItemId) => ({
                url: `/user/remove-cart/${cartItemId}`,
                method: 'GET',
            }),
            invalidatesTags: ['Cart'],
        }),
        directPurchaseChapter: builder.mutation({
            query: (body) => ({
                url: `/user/direct-purchase`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_, __, body) => [{ type: 'SingleChapter', id: body.chapter_id }],
        }),
    }),
});

export const {
    useAddChapterToCartMutation,
    useRemoveCartItemMutation,
    useDirectPurchaseChapterMutation,
} = clientSidePostApis;
