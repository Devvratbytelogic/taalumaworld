import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import { IAddAgreementTypeAPIResponse, IAllAgreementTypesAPIResponse, } from '@/types/agreementTypes';

export const agreementAPIs = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** Agreement Types */
        getAllAgreementTypes: builder.query<IAllAgreementTypesAPIResponse, { page?: number; limit?: number; search?: string; status?: string; isDeleted?: boolean } | void>({
            query: (params) => ({
                url: `/admin/agreement-types`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminAgreementTypes'],
        }),
        getAgreementTypeById: builder.query<IAddAgreementTypeAPIResponse, string>({
            query: (id) => ({
                url: `/admin/agreement-types/${id}`,
                method: 'GET',
            }),
            providesTags: ['AdminAgreementTypes'],
        }),
        addAgreementType: builder.mutation({
            query: (payload) => ({
                url: `/admin/agreement-types`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminAgreementTypes'],
        }),
        updateAgreementType: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/agreement-types/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminAgreementTypes'],
        }),
        deleteAgreementType: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/agreement-types/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminAgreementTypes'],
        }),
        restoreAgreementType: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/agreement-types/restore/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['AdminAgreementTypes'],
        }),
    }),
});

export const {
    // Agreement Types
    useGetAllAgreementTypesQuery,
    useGetAgreementTypeByIdQuery,
    useAddAgreementTypeMutation,
    useUpdateAgreementTypeMutation,
    useDeleteAgreementTypeMutation,
    useRestoreAgreementTypeMutation,
} = agreementAPIs;
