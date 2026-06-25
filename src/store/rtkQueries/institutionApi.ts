import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type {
    IAllInstitutionsAPIResponse,
    ISingleInstitutionAPIResponse,
    IInstitutionUsageReportAPIResponse,
    IRegistrationPromptAPIResponse,
} from '@/types/institution';
import {
    DUMMY_INSTITUTIONS,
    DUMMY_INSTITUTION_BY_ID,
    DUMMY_USAGE_REPORT,
    DUMMY_REGISTRATION_PROMPT,
    DUMMY_MUTATION_SUCCESS,
} from '@/app/admin/institutions/dummydata';

export const institutionApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({

        // ── GET endpoints ──────────────────────────────────────────────────────

        /** List all partner institutions */
        getAllInstitutions: builder.query<IAllInstitutionsAPIResponse, void>({
            // query: () => ({ url: `/admin/institutions`, method: 'GET' }),
            queryFn: () => ({ data: DUMMY_INSTITUTIONS }),
            providesTags: ['AdminInstitutions'],
        }),

        /** Single institution details */
        getInstitutionById: builder.query<ISingleInstitutionAPIResponse, string>({
            // query: (id) => ({ url: `/admin/institutions/${id}`, method: 'GET' }),
            queryFn: (_id) => ({ data: DUMMY_INSTITUTION_BY_ID }),
            providesTags: (_result, _err, id) => [{ type: 'AdminInstitutions', id }],
        }),

        /** Usage / analytics report for all institutions */
        getInstitutionUsageReport: builder.query<IInstitutionUsageReportAPIResponse, void>({
            // query: () => ({ url: `/admin/institutions/usage-report`, method: 'GET' }),
            queryFn: () => ({ data: DUMMY_USAGE_REPORT }),
            providesTags: ['AdminInstitutionUsage'],
        }),

        /** Registration prompt settings */
        getRegistrationPromptSettings: builder.query<IRegistrationPromptAPIResponse, void>({
            // query: () => ({ url: `/admin/institutions/registration-prompt`, method: 'GET' }),
            queryFn: () => ({ data: DUMMY_REGISTRATION_PROMPT }),
            providesTags: ['AdminRegistrationPrompt'],
        }),

        // ── Mutation endpoints ──────────────────────────────────────────────────

        /** Create a new institution */
        addInstitution: builder.mutation({
            // query: (payload) => ({ url: `/admin/institutions`, method: 'POST', body: payload }),
            queryFn: (_payload) => ({ data: DUMMY_MUTATION_SUCCESS }),
            invalidatesTags: ['AdminInstitutions', 'AdminInstitutionUsage'],
        }),

        /** Update institution details */
        updateInstitution: builder.mutation({
            // query: ({ id, values }: { id: string; values: Record<string, unknown> }) => ({ url: `/admin/institutions/${id}`, method: 'PUT', body: values }),
            queryFn: (_args: { id: string; values: Record<string, unknown> }) => ({
                data: DUMMY_MUTATION_SUCCESS,
            }),
            invalidatesTags: ['AdminInstitutions', 'AdminInstitutionUsage'],
        }),

        /** Suspend an institution (pause promotional access) */
        suspendInstitution: builder.mutation({
            // query: ({ id }: { id: string }) => ({ url: `/admin/institutions/${id}/suspend`, method: 'PUT' }),
            queryFn: (_args: { id: string }) => ({ data: DUMMY_MUTATION_SUCCESS }),
            invalidatesTags: ['AdminInstitutions'],
        }),

        /** Restore a suspended institution */
        restoreInstitution: builder.mutation({
            // query: ({ id }: { id: string }) => ({ url: `/admin/institutions/${id}/restore`, method: 'PUT' }),
            queryFn: (_args: { id: string }) => ({ data: DUMMY_MUTATION_SUCCESS }),
            invalidatesTags: ['AdminInstitutions'],
        }),

        /** Terminate an institution partnership */
        terminateInstitution: builder.mutation({
            // query: ({ id }: { id: string }) => ({ url: `/admin/institutions/${id}/terminate`, method: 'PUT' }),
            queryFn: (_args: { id: string }) => ({ data: DUMMY_MUTATION_SUCCESS }),
            invalidatesTags: ['AdminInstitutions'],
        }),

        /** Delete an institution (hard delete) */
        deleteInstitution: builder.mutation({
            // query: ({ id }: { id: string }) => ({ url: `/admin/institutions/${id}`, method: 'DELETE' }),
            queryFn: (_args: { id: string }) => ({ data: DUMMY_MUTATION_SUCCESS }),
            invalidatesTags: ['AdminInstitutions', 'AdminInstitutionUsage'],
        }),

        /** Update which blueprints are enabled for an institution */
        updateInstitutionBlueprintAccess: builder.mutation({
            // query: ({ id, blueprint_ids }: { id: string; blueprint_ids: string[] }) => ({ url: `/admin/institutions/${id}/blueprints`, method: 'PUT', body: { blueprint_ids } }),
            queryFn: (_args: { id: string; blueprint_ids: string[] }) => ({
                data: DUMMY_MUTATION_SUCCESS,
            }),
            invalidatesTags: (_result, _err, { id }) => [{ type: 'AdminInstitutions', id }],
        }),

        /** Extend promotional period for an institution */
        extendPromotionalPeriod: builder.mutation({
            // query: ({ id, end_date }: { id: string; end_date: string }) => ({ url: `/admin/institutions/${id}/extend-promotion`, method: 'PUT', body: { end_date } }),
            queryFn: (_args: { id: string; end_date: string }) => ({
                data: DUMMY_MUTATION_SUCCESS,
            }),
            invalidatesTags: ['AdminInstitutions'],
        }),

        /** Update registration prompt settings */
        updateRegistrationPrompt: builder.mutation({
            // query: (payload) => ({ url: `/admin/institutions/registration-prompt`, method: 'PUT', body: payload }),
            queryFn: (_payload) => ({ data: DUMMY_MUTATION_SUCCESS }),
            invalidatesTags: ['AdminRegistrationPrompt'],
        }),
    }),
});

export const {
    // Queries
    useGetAllInstitutionsQuery,
    useGetInstitutionByIdQuery,
    useGetInstitutionUsageReportQuery,
    useGetRegistrationPromptSettingsQuery,

    // Mutations
    useAddInstitutionMutation,
    useUpdateInstitutionMutation,
    useSuspendInstitutionMutation,
    useRestoreInstitutionMutation,
    useTerminateInstitutionMutation,
    useDeleteInstitutionMutation,
    useUpdateInstitutionBlueprintAccessMutation,
    useExtendPromotionalPeriodMutation,
    useUpdateRegistrationPromptMutation,
} = institutionApi;
