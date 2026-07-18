import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export interface IUpdateReadingProgressPayload {
    chapter_id: string;
    percentage: number;
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
        removeCartItem: builder.mutation({
            query: (cartItemId) => ({
                url: `/user/remove-cart/${cartItemId}`,
                method: 'GET',
            }),
            invalidatesTags: ['Cart'],
        }),
        applyCoupon: builder.mutation({
            query: (body) => ({
                url: `/user/apply-coupon`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Cart'],
        }),
        removeCoupon: builder.mutation({
            query: () => ({
                url: `/user/remove-coupon`,
                method: 'GET',
            }),
            invalidatesTags: ['Cart'],
        }),
        addToWishlist: builder.mutation({
            query: (body) => ({
                url: `/user/wishlist`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Wishlist', 'AllChapters'],
        }),
        removeFromWishlist: builder.mutation({
            query: ({wishlistItemId, type}) => ({
                url: `/user/wishlist/${wishlistItemId}/${type}`,
                method: 'DELETE',
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
        /** update reading progress for a chapter (PDF page / content scroll position) */
        updateReadingProgress: builder.mutation<void, IUpdateReadingProgressPayload>({
            query: (body) => ({
                url: `/user/content/reading-progress`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['MyChapters', 'ReadingHistory'],
        }),
        /** Career Architect → Mentor conversion request (POST /user/mentor-applications, form-data) */
        submitMentorApplication: builder.mutation({
            query: (body) => ({
                url: `/user/mentor-applications`,
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
    useApplyCouponMutation,
    useRemoveCouponMutation,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
    useDirectPurchaseChapterMutation,
    useCheckOutCartMutation,
    usePostContactUsMutation,
    useSubscribeToNewsletterMutation,
    useMpesaPaymentMutation,
    // useMpesaPaymentCallbackMutation,
    useUpdateReadingProgressMutation,
    useSubmitMentorApplicationMutation,
} = clientSidePostApis;
