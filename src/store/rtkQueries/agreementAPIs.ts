import { IAllAgreementsAPIResponse, IGetAgreementByTouchpointAndUserTypeAPIResponse, IGetUserConsentStatusAPIResponse, ISingleAgreementAPIResponse } from '@/types/agreements';
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

        /** Agreements */
        getAllAgreements: builder.query<IAllAgreementsAPIResponse, { page?: number; limit?: number; search?: string; status?: string; agreementType?: string } | void>({
            query: (params) => ({
                url: `/admin/agreements`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminAgreements'],
        }),
        getAgreementById: builder.query<ISingleAgreementAPIResponse, string>({
            query: (id) => ({
                url: `/admin/agreements/${id}`,
                method: 'GET',
            }),
            providesTags: ['AdminAgreements'],
        }),
        getAgreementByTouchpointAndUserType: builder.query<IGetAgreementByTouchpointAndUserTypeAPIResponse, { touchPoint: string; userType: string }>({
            query: ({ touchPoint, userType }) => ({
                url: `/admin/agreements/by-touchpoint-and-user-type`,
                method: 'GET',
                params: { touchPoint, userType },
            }),
            providesTags: ['AdminAgreements'],
        }),
        addAgreement: builder.mutation({
            query: (payload) => ({
                url: `/admin/agreements`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminAgreements'],
        }),
        updateAgreement: builder.mutation({
            query: ({ agreementId, values }) => ({
                url: `/admin/agreements/${agreementId}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminAgreements'],
        }),
        acceptAgreement: builder.mutation({
            query: (payload) => ({
                url: `/admin/agreements/accept`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminAgreements', 'AdminUserConsentStatus'],
        }),
        acceptAllAgreements: builder.mutation({
            query: (payload) => ({
                url: `/admin/agreements/accept-all`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminAgreements', 'AdminUserConsentStatus'],
        }),
        getUserConsentStatus: builder.query<IGetUserConsentStatusAPIResponse, { userType: string }>({
            query: ({ userType }) => ({
                url: `/admin/agreements/user-consent-status/${userType}`,
                method: 'GET',
            }),
            providesTags: ['AdminUserConsentStatus'],
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

    // Agreements
    useGetAllAgreementsQuery,
    useGetAgreementByIdQuery,
    useGetAgreementByTouchpointAndUserTypeQuery,
    useAddAgreementMutation,
    useUpdateAgreementMutation,
    useAcceptAgreementMutation,
    useAcceptAllAgreementsMutation,
    useGetUserConsentStatusQuery,
} = agreementAPIs;
