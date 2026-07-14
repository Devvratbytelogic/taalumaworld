import { IAllInstitutionsAPIResponse, IInstituteMessageAPIResponse, IInstitutionAccessAPIResponse, ISingleInstitutionAPIResponse } from '@/types/institution';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const institutionApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** Institutions */
        getAllInstitutions: builder.query<IAllInstitutionsAPIResponse, { page?: number; limit?: number; search?: string; status?: string; isDeleted?: boolean } | void>({
            query: (params) => ({
                url: `/admin/institutions`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminInstitutions'],
        }),
        getInstitutionById: builder.query<ISingleInstitutionAPIResponse, string>({
            query: (id) => ({
                url: `/admin/institutions/${id}`,
                method: 'GET',
            }),
            providesTags: ['AdminInstitutions'],
        }),
        addInstitution: builder.mutation({
            query: (payload) => ({
                url: `/admin/institutions`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminInstitutions'],
        }),
        updateInstitution: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/institutions/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminInstitutions'],
        }),
        deleteInstitution: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/institutions/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminInstitutions'],
        }),
        restoreInstitution: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/institutions/restore/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['AdminInstitutions'],
        }),

        /** Institution Access */
        getInstitutionAccess: builder.query<IInstitutionAccessAPIResponse, { institutionId: string; search?: string; page?: number; limit?: number }>({
            query: ({ institutionId, ...params }) => ({
                url: `/admin/institutions/${institutionId}/access`,
                method: 'GET',
                params,
            }),
            providesTags: ['AdminInstitutionAccess'],
        }),
        addInstitutionAccess: builder.mutation({
            query: ({ institutionId, values }) => ({
                url: `/admin/institutions/${institutionId}/access`,
                method: 'POST',
                body: values,
            }),
            invalidatesTags: ['AdminInstitutionAccess'],
        }),
        updateInstitutionAccess: builder.mutation({
            query: ({ institutionId, accessId, values }) => ({
                url: `/admin/institutions/${institutionId}/access/${accessId}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminInstitutionAccess'],
        }),
        deleteInstitutionAccess: builder.mutation({
            query: ({ institutionId, accessId }) => ({
                url: `/admin/institutions/${institutionId}/access/${accessId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminInstitutionAccess'],
        }),

        /** Bulk book pricing */
        bulkUpdateBookPricing: builder.mutation({
            query: (payload) => ({
                url: `/admin/institutions/bulk-update-book-pricing`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminInstitutions'],
        }),

        /** Institute Messages */
        getInstituteMessages: builder.query<IInstituteMessageAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/institute-message`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminInstituteMessages'],
        }),
        addInstituteMessage: builder.mutation({
            query: (payload) => ({
                url: `/admin/institute-message`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminInstituteMessages'],
        }),
        updateInstituteMessage: builder.mutation({
            query: ({ messageId, values }) => ({
                url: `/admin/institute-message/${messageId}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminInstituteMessages'],
        }),
    }),
});

export const {
    // Institutions
    useGetAllInstitutionsQuery,
    useGetInstitutionByIdQuery,
    useAddInstitutionMutation,
    useUpdateInstitutionMutation,
    useDeleteInstitutionMutation,
    useRestoreInstitutionMutation,

    // Institution Access
    useGetInstitutionAccessQuery,
    useAddInstitutionAccessMutation,
    useUpdateInstitutionAccessMutation,
    useDeleteInstitutionAccessMutation,

    // Bulk book pricing
    useBulkUpdateBookPricingMutation,

    // Institute Messages
    useGetInstituteMessagesQuery,
    useAddInstituteMessageMutation,
    useUpdateInstituteMessageMutation,
} = institutionApi;
