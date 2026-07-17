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
        addToWishlist: builder.mutation({
            query: (body) => ({
                url: `/user/add-wishlist`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Wishlist', 'AllChapters'],
        }),
        removeFromWishlist: builder.mutation({
            query: (wishlistItemId) => ({
                url: `/user/remove-wishlist/${wishlistItemId}`,
                method: 'GET',
            }),
            invalidatesTags: ['Wishlist', 'AllChapters'],
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
        // mpesaPaymentCallback: builder.mutation({
        //     query: (body) => ({
        //         url: `/user/mpaisa/callback`,
        //         method: 'POST',
        //         body,
        //     }),
        // }),
    }),
});

export const {
    useAddChapterToCartMutation,
    useRemoveCartItemMutation,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
    useDirectPurchaseChapterMutation,
    useCheckOutCartMutation,
    usePostContactUsMutation,
    useSubscribeToNewsletterMutation,
    useMpesaPaymentMutation,
    // useMpesaPaymentCallbackMutation,
} = clientSidePostApis;
