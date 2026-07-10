import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type {
    IAllRolesAPIResponse,
    IPermissionsMatrixAPIResponse,
    IAllStaffAPIResponse,
    IAllUserSegmentsAPIResponse,
    IMutationAPIResponse,
} from '@/types/rolesPermissions';
import {
    DUMMY_PERMISSIONS_MATRIX,
    DUMMY_USER_SEGMENTS,
    DUMMY_MUTATION_SUCCESS,
} from '@/app/admin/roles-and-permissions/dummydata';

export const rolesPermissionsApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({

        // ── GET endpoints ──────────────────────────────────────────────────────

        getAllRoles: builder.query<IAllRolesAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => (
                {
                    url: `/admin/get-roles`,
                    method: 'GET',
                    params: params ?? {}
                }),
            providesTags: ['AdminRoles'],
        }),
        addRole: builder.mutation({
            query: (payload) => (
                {
                    url: `/admin/add-role`,
                    method: 'POST',
                    body: payload
                }),
            invalidatesTags: ['AdminRoles'],
        }),
        updateRole: builder.mutation({
            query: ({ payload, id }) => (
                {
                    url: `/admin/update-role/${id}`,
                    method: 'PUT',
                    body: payload
                }),
            invalidatesTags: ['AdminRoles'],
        }),
        deleteRole: builder.mutation({
            query: ({ id }) => (
                {
                    url: `/admin/delete-role/${id}`,
                    method: 'DELETE',
                }),
            invalidatesTags: ['AdminRoles'],
        }),

        getPermissionsMatrix: builder.query<IPermissionsMatrixAPIResponse, void>({
            // query: () => ({ url: `/admin/roles/permissions-matrix`, method: 'GET' }),
            queryFn: () => ({ data: DUMMY_PERMISSIONS_MATRIX }),
            providesTags: ['AdminPermissions'],
        }),

        getAllStaff: builder.query<IAllStaffAPIResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => ({
                url: `/admin/get-all-users`,
                method: 'GET',
                params: params ?? {}
            }),
            providesTags: ['AdminStaff'],
        }),
        addStaff: builder.mutation({
            query: (payload) => ({
                url: `/admin/register-staff`,
                method: 'POST',
                body: payload
            }),
            invalidatesTags: ['AdminStaff'],
        }),
        updateStaff: builder.mutation({
            query: ({ id, payload }) => ({
                url: `/admin/register-staff/${id}`,
                method: 'PUT',
                body: payload
            }),
            invalidatesTags: ['AdminStaff'],
        }),
        updateStaffStatus: builder.mutation({
            query: ({ id, payload }) => ({
                url: `/admin/update-user-status/${id}`,
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['AdminStaff'],
        }),

        getUserSegments: builder.query<IAllUserSegmentsAPIResponse, void>({
            // query: () => ({ url: `/admin/user-segments`, method: 'GET' }),
            queryFn: () => ({ data: DUMMY_USER_SEGMENTS }),
            providesTags: ['AdminRoles'],
        }),

        updateRolePermissions: builder.mutation<IMutationAPIResponse, { roleId: string; permissionIds: string[] }>({
            // query: ({ roleId, permissionIds }) => ({ url: `/admin/roles/${roleId}/permissions`, method: 'PUT', body: { permissionIds } }),
            queryFn: () => ({ data: DUMMY_MUTATION_SUCCESS }),
        }),

        assignStaffRole: builder.mutation<IMutationAPIResponse, { staffId: string; roleId: string }>({
            // query: ({ staffId, roleId }) => ({ url: `/admin/staff/${staffId}/role`, method: 'PUT', body: { roleId } }),
            queryFn: () => ({ data: DUMMY_MUTATION_SUCCESS }),
        }),


    }),
});

export const {
    useGetAllRolesQuery,
    useGetPermissionsMatrixQuery,
    useGetAllStaffQuery,
    useGetUserSegmentsQuery,
    useAddRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useUpdateRolePermissionsMutation,
    useAddStaffMutation,
    useUpdateStaffMutation,
    useUpdateStaffStatusMutation,
} = rolesPermissionsApi;
