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
        inviteMentor: builder.mutation({
            query: (payload: FormData) => ({
                url: `/admin/invite-mentor`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminStaff'],
        }),



        /** Books */
        addBook: builder.mutation({
            query: (payload) => ({
                url: `/admin/series`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminBooks'],
        }),
        updateBook: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/series/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminBooks'],
        }),
        deleteBook: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/series/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminBooks'],
        }),
        restoreBook: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/series/restore/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['AdminBooks'],
        }),


        /** Chapters */
        addChapter: builder.mutation({
            query: (payload: FormData) => ({
                url: `/admin/blueprints`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminChapters'],
        }),
        updateChapter: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/blueprints/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminChapters'],
        }),
        deleteChapter: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/blueprints/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminChapters'],
        }),
        restoreChapter: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/blueprints/restore/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['AdminChapters'],
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

        /** Admin Profile */
        updateAdminProfile: builder.mutation({
            query: (payload: FormData) => ({
                url: `/admin/update-profile`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminProfile'],
        }),
        updateProfilePic: builder.mutation({
            query: (payload: FormData) => ({
                url: `/admin/update-profile-pic`,
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['AdminProfile', 'UserProfile'],
        }),
        updateMentorInfo: builder.mutation({
            query: (payload) => ({
                url: `/admin/update-mentor-info`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminProfile', 'AdminUserConsentStatus'],
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
    useInviteMentorMutation,

    // Books
    useAddBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
    useRestoreBookMutation,


    // Chapters
    useAddChapterMutation,
    useUpdateChapterMutation,
    useDeleteChapterMutation,
    useRestoreChapterMutation,

    // Testimonials
    useAddTestimonialMutation,
    useUpdateTestimonialMutation,
    useDeleteTestimonialMutation,


    // FAQs
    useAddFAQMutation,
    useUpdateFAQMutation,
    useDeleteFAQMutation,

    // Admin Profile
    useUpdateAdminProfileMutation,
    useUpdateProfilePicMutation,
    useUpdateMentorInfoMutation,
} = adminPostApi;
