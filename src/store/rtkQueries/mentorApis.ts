import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type { IAllMentorTiersAPIResponse, IGetMentorTierByIdAPIResponse } from '@/types/mentorTier';
import type { IAllMentorApplicationsAPIResponse } from '@/types/mentorApplication';
import type {
    IAllMentorTierUpgradeApplicationsAPIResponse,
    IGetMyMentorTierUpgradeApplicationAPIResponse,
    IReviewMentorTierUpgradeApplicationAPIResponse,
    IReviewMentorTierUpgradeApplicationPayload,
} from '@/types/mentorTierUpgradeApplication';
import { IFollowsAPIResponse } from '@/types/follows';
import type { IAssignMentorTierAPIResponse } from '@/types/mentorEquity';


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
            invalidatesTags: ['AdminMentorTiers', 'AdminMentorEquity', 'MyMentorEquity'],
        }),
        updateMentorTier: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/mentor-tiers/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminMentorTiers', 'AdminMentorEquity', 'MyMentorEquity'],
        }),
        assignMentorTier: builder.mutation<
            IAssignMentorTierAPIResponse,
            { mentorId: string; tier_id?: string; tier_code?: string; admin_notes?: string }
        >({
            query: ({ mentorId, tier_id, tier_code, admin_notes }) => ({
                url: `/admin/mentors/${mentorId}/tier`,
                method: 'PUT',
                body: {
                    ...(tier_id ? { tier_id } : {}),
                    ...(tier_code ? { tier_code } : {}),
                    ...(admin_notes?.trim() ? { admin_notes: admin_notes.trim() } : {}),
                },
            }),
            invalidatesTags: ['AdminStaff', 'AdminMentorTiers', 'AdminMentorEquity', 'MyMentorEquity', 'AdminProfile'],
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

        withdrawMentorTierUpgrade: builder.mutation<{ http_status_code?: number; success?: boolean; message?: string }, void>({
            query: () => ({
                url: `/admin/mentor-tier-upgrade-applications/withdraw`,
                method: 'POST',
            }),
            invalidatesTags: ['AdminMentorTierUpgradeApplications', 'MyMentorTierUpgradeApplication'],
        }),

        getMyMentorTierUpgradeApplication: builder.query<IGetMyMentorTierUpgradeApplicationAPIResponse, void>({
            query: () => ({
                url: `/admin/mentor-tier-upgrade-applications/my`,
                method: 'GET',
            }),
            providesTags: ['MyMentorTierUpgradeApplication'],
        }),

        getAllMentorTierUpgradeApplications: builder.query<IAllMentorTierUpgradeApplicationsAPIResponse, { status?: string; page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/mentor-tier-upgrade-applications`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminMentorTierUpgradeApplications'],
        }),

        reviewMentorTierUpgradeApplication: builder.mutation<
            IReviewMentorTierUpgradeApplicationAPIResponse,
            { id: string; values: IReviewMentorTierUpgradeApplicationPayload }
        >({
            query: ({ id, values }) => ({
                url: `/admin/mentor-tier-upgrade-applications/${id}/review`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminMentorTierUpgradeApplications', 'MyMentorTierUpgradeApplication', 'AdminMentorEquity', 'MyMentorEquity', 'AdminStaff', 'AdminProfile'],
        }),

        /** Followers */
        getAllFollowers: builder.query<IFollowsAPIResponse, { fromDate?: string; toDate?: string; page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/followers`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminFollowers'],
        }),
    }),
});

export const {
    useGetAllMentorTiersQuery,
    useGetMentorTierByIdQuery,
    useAddMentorTierMutation,
    useUpdateMentorTierMutation,
    useAssignMentorTierMutation,
    useGetAllMentorApplicationsQuery,
    useReviewMentorApplicationMutation,
    useApplyMentorTierUpgradeMutation,
    useWithdrawMentorTierUpgradeMutation,
    useGetMyMentorTierUpgradeApplicationQuery,
    useGetAllMentorTierUpgradeApplicationsQuery,
    useReviewMentorTierUpgradeApplicationMutation,
    useGetAllFollowersQuery,
} = mentorApis;
