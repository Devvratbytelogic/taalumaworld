import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type { IAllMentorTiersAPIResponse, IGetMentorTierByIdAPIResponse } from '@/types/mentorTier';
import type { IAllMentorApplicationsAPIResponse } from '@/types/mentorApplication';


export const mentorApis = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** Mentor Tiers */
        getAllMentorTiers: builder.query<IAllMentorTiersAPIResponse, { status?: string; page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/mentor-tiers`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminMentorTiers'],
        }),
        getMentorTierById: builder.query<IGetMentorTierByIdAPIResponse, string>({
            query: (id) => ({
                url: `/admin/mentor-tiers/${id}`,
                method: 'GET',
            }),
            providesTags: ['AdminMentorTiers'],
        }),
        addMentorTier: builder.mutation({
            query: (payload) => ({
                url: `/admin/mentor-tiers`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminMentorTiers'],
        }),
        updateMentorTier: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/mentor-tiers/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminMentorTiers'],
        }),


        /** Mentor Applications (Career Architect → Mentor conversion requests) */
        getAllMentorApplications: builder.query<IAllMentorApplicationsAPIResponse, { status?: string; page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/mentor-applications`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminMentorApplications'],
        }),
        reviewMentorApplication: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/mentor-applications/${id}/review`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminMentorApplications'],
        }),

        /** Mentor Tier Upgrade Applications */
        applyMentorTierUpgrade: builder.mutation({
            query: (payload) => ({
                url: `/admin/mentor-tier-upgrade-applications`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AdminMentorTierUpgradeApplications', 'MyMentorTierUpgradeApplication'],
        }),

        getMyMentorTierUpgradeApplication: builder.query<any, void>({
            query: () => ({
                url: `/admin/mentor-tier-upgrade-applications/my`,
                method: 'GET',
            }),
            providesTags: ['MyMentorTierUpgradeApplication'],
        }),

        getAllMentorTierUpgradeApplications: builder.query<any, { status?: string; page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/mentor-tier-upgrade-applications`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminMentorTierUpgradeApplications'],
        }),
        
        reviewMentorTierUpgradeApplication: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/mentor-tier-upgrade-applications/${id}/review`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminMentorTierUpgradeApplications', 'MyMentorTierUpgradeApplication'],
        }),
    }),
});

export const {
    useGetAllMentorTiersQuery,
    useGetMentorTierByIdQuery,
    useAddMentorTierMutation,
    useUpdateMentorTierMutation,
    useGetAllMentorApplicationsQuery,
    useReviewMentorApplicationMutation,
    useApplyMentorTierUpgradeMutation,
    useGetMyMentorTierUpgradeApplicationQuery,
    useGetAllMentorTierUpgradeApplicationsQuery,
    useReviewMentorTierUpgradeApplicationMutation,
} = mentorApis;
