import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const clientSideGetApis = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        addChapterToCart: builder.mutation({
            query: (body) => ({
                url: `/user/add-cart`,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useAddChapterToCartMutation,
} = clientSideGetApis;
