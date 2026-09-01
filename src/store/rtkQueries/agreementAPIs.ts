import { IAllAgreementsAPIResponse, IAgreementsByTouchpointAPIResponse, IAllAgreementSentencesAPIResponse, IGetUserConsentStatusAPIResponse, ISingleAgreementAPIResponse } from '@/types/agreements';
import { IAgreementAPIResponse } from '@/types/user/agreement';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import { IAddAgreementTypeAPIResponse, IAllAgreementTypesAPIResponse, } from '@/types/agreementTypes';


export const agreementAPIs = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
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
        getAgreementsByTouchpoint: builder.query<IAgreementsByTouchpointAPIResponse, string>({
            query: (touchpoint) => ({
                url: `/user/agreements/by-touchpoint`,
                method: 'GET',
                params: { touchpoint },
            }),
            providesTags: ['UserAgreementSentences'],
        }),
        getUserAgreementByIdOrSlug: builder.query<IAgreementAPIResponse, string>({
            query: (idOrSlug) => ({
                url: `/user/agreements/${idOrSlug}`,
                method: 'GET',
            }),
        }),
        getAllAgreementSentences: builder.query<IAllAgreementSentencesAPIResponse, { touchpoint?: string } | void>({
            query: (params) => ({
                url: `/admin/agreements/sentences`,
                method: 'GET',
                params: params?.touchpoint ? { touchpoint: params.touchpoint } : {},
            }),
            providesTags: ['AdminAgreementSentences'],
        }),
        addAgreementSentence: builder.mutation({
            query: (payload) => ({
                url: `/admin/agreements/sentences`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminAgreementSentences', 'UserAgreementSentences'],
        }),
        updateAgreementSentence: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/agreements/sentences/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminAgreementSentences', 'UserAgreementSentences'],
        }),
        deleteAgreementSentence: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/agreements/sentences/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminAgreementSentences', 'UserAgreementSentences'],
        }),
        addAgreement: builder.mutation({
            query: (payload) => ({
                url: `/admin/agreements`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminAgreements', 'UserAgreementSentences'],
        }),
        updateAgreement: builder.mutation({
            query: ({ agreementId, values }) => ({
                url: `/admin/agreements/${agreementId}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminAgreements', 'UserAgreementSentences', 'AdminUserConsentStatus'],
        }),
        acceptAgreement: builder.mutation({
            query: (payload) => ({
                url: `/admin/agreements/accept`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminAgreements', 'AdminUserConsentStatus', 'UserProfile'],
        }),
        acceptAllAgreements: builder.mutation<unknown, void>({
            query: () => ({
                url: `/admin/agreements/accept-all`,
                method: 'POST',
            }),
            invalidatesTags: ['AdminAgreements', 'AdminUserConsentStatus'],
        }),
        getUserConsentStatus: builder.query<IGetUserConsentStatusAPIResponse, { userType?: string } | void>({
            query: (params) => ({
                url: params?.userType
                    ? `/admin/agreements/user-consent-status/${params.userType}`
                    : `/admin/agreements/user-consent-status`,
                method: 'GET',
            }),
            providesTags: ['AdminUserConsentStatus'],
        }),
    }),
});

export const {
    useGetAllAgreementTypesQuery,
    useGetAgreementTypeByIdQuery,
    useAddAgreementTypeMutation,
    useUpdateAgreementTypeMutation,
    useDeleteAgreementTypeMutation,
    useRestoreAgreementTypeMutation,

    useGetAllAgreementsQuery,
    useGetAgreementByIdQuery,
    useGetAgreementsByTouchpointQuery,
    useGetUserAgreementByIdOrSlugQuery,
    useGetAllAgreementSentencesQuery,
    useAddAgreementSentenceMutation,
    useUpdateAgreementSentenceMutation,
    useDeleteAgreementSentenceMutation,
    useAddAgreementMutation,
    useUpdateAgreementMutation,
    useAcceptAgreementMutation,
    useAcceptAllAgreementsMutation,
    useGetUserConsentStatusQuery,
} = agreementAPIs;
