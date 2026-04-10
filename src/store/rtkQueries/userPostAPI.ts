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
        removeCartItem: builder.mutation({
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
            invalidatesTags: (_, __, body) => [{ type: 'SingleChapter', id: body.chapter_id }, 'AllChapters', 'MyChapters'],
        }),
        checkOutCart: builder.mutation({
            query: (body) => ({
                url: `/user/checkout`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Cart', 'AllChapters', 'MyChapters'],
        }),
        updateReadingProgress: builder.mutation({
            query: (body) => ({
                url: `/user/content/reading-progress`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['ReadingHistory', 'MyChapters'],
        }),
        postContactUs: builder.mutation({
            query: (body) => ({
                url: `/user/post-contact-us`,
                method: 'POST',
                body,
            }),
        }),
        subscribeToNewsletter: builder.mutation({
            query: (body) => ({
                url: `/user/post-subscribers`,
                method: 'POST',
                body,
            }),
        }),
        mpesaPayment: builder.mutation({
            query: (body) => ({
                url: `/user/mpaisa/pay`,
                method: 'POST',
                body,
            }),
        }),
        mpesaPaymentCallback: builder.mutation({
            query: (body) => ({
                url: `/user/mpaisa/callback`,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useAddChapterToCartMutation,
    useRemoveCartItemMutation,
    useDirectPurchaseChapterMutation,
    useCheckOutCartMutation,
    useUpdateReadingProgressMutation,
    usePostContactUsMutation,
    useSubscribeToNewsletterMutation,
    useMpesaPaymentMutation,
    useMpesaPaymentCallbackMutation,
} = clientSidePostApis;
