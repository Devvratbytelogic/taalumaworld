import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export interface ICheckOutCartPayload {
  payment_method: 'Razorpay';
  amount: number;
  transaction_id: string;
  payment_status: 'Paid';
}

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
        checkOutCart: builder.mutation<void, ICheckOutCartPayload>({
            query: (body) => ({
                url: `/user/checkout`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const {
    useAddChapterToCartMutation,
    useRemoveCartItemMutation,
    useDirectPurchaseChapterMutation,
    useCheckOutCartMutation,
} = clientSidePostApis;
