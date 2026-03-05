import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const adminPostApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** categories */
        addCategory: builder.mutation({
            query: (payload) => ({
                url: `/admin/categories`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminCategories'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/categories/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminCategories'],
        }),
        deleteCategory: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminCategories'],
        }),


        /** Author Leaders */
        addAuthorLeader: builder.mutation({
            query: (payload) => ({
                url: `/admin/leaders`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminAuthorLeaders'],
        }),
        updateAuthorLeader: builder.mutation({
            query: ({ id, values }: { id: string; values: FormData }) => ({
                url: `/admin/leaders/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminAuthorLeaders'],
        }),
        deleteAuthorLeader: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/leaders/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminAuthorLeaders'],
        }),
    }),
});

export const {
    // Categories
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,

    // Author Leaders
    useAddAuthorLeaderMutation,
    useUpdateAuthorLeaderMutation,
    useDeleteAuthorLeaderMutation,
} = adminPostApi;
