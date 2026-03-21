import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const clientSidePostApis = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        addChapterToCart: builder.mutation({
            query: (body) => ({
                url: `/user/add-cart`,
                method: 'POST',
                body,
            }),
        }),
        removeCartItem: builder.mutation<void, string>({
            query: (cartItemId) => ({
                url: `/user/cart/${cartItemId}`,
                method: 'DELETE',
            }),
        }),
        clearCart: builder.mutation<void, void>({
            query: () => ({
                url: `/user/cart`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useAddChapterToCartMutation,
    useRemoveCartItemMutation,
    useClearCartMutation,
} = clientSidePostApis;
