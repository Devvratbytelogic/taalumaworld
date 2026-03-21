import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const adminPostApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** global settings */
        updateGlobalSettings: builder.mutation({
            query: (payload) => ({
                url: `/admin/update-global-setting`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['GlobalSettings'],
        }),


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



        /** Books */
        addBook: builder.mutation({
            query: (payload) => ({
                url: `/admin/books`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminBooks'],
        }),
        updateBook: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/books/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminBooks'],
        }),
        deleteBook: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/books/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminBooks'],
        }),


        /** Chapters */
        addChapter: builder.mutation({
            query: (payload: FormData) => ({
                url: `/admin/chapters`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminChapters'],
        }),
        updateChapter: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/chapters/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminChapters'],
        }),
        deleteChapter: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/chapters/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminChapters'],
        }),


        /** users */
        suspendUser: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/block-user/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['AdminUsers'],
        }),

        /** testimonials */
        addTestimonial: builder.mutation({
            query: (payload) => ({
                url: `/admin/testimonial`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminTestimonials'],
        }),
        updateTestimonial: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/testimonial/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminTestimonials'],
        }),
        deleteTestimonial: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/testimonial/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminTestimonials'],
        }),

        /** FAQs */
        addFAQ: builder.mutation({
            query: (payload) => ({
                url: `/admin/faqs`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminFAQs'],
        }),
        updateFAQ: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/faqs/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminFAQs'],
        }),
        deleteFAQ: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/faqs/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminFAQs'],
        }),
    }),
});

export const {
    // Global Settings
    useUpdateGlobalSettingsMutation,

    // Categories
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,

    // Author Leaders
    useAddAuthorLeaderMutation,
    useUpdateAuthorLeaderMutation,
    useDeleteAuthorLeaderMutation,

    // Books
    useAddBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,


    // Chapters
    useAddChapterMutation,
    useUpdateChapterMutation,
    useDeleteChapterMutation,

    // Users
    useSuspendUserMutation,

    // Testimonials
    useAddTestimonialMutation,
    useUpdateTestimonialMutation,
    useDeleteTestimonialMutation,


    // FAQs
    useAddFAQMutation,
    useUpdateFAQMutation,
    useDeleteFAQMutation,
} = adminPostApi;
