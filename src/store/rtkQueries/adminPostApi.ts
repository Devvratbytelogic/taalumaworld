import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const adminPostApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
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
    }),
});

export const {
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = adminPostApi;
