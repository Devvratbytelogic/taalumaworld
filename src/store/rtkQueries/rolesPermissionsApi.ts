import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type {
    IAllModelsAPIResponse,
    IAllPermissionsAPIResponse,
    IAllRolePermissionsAPIResponse,
    IAllRolesAPIResponse,
    IAllUsersAPIResponse,
} from '@/types/rolesPermissions';

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
        getAllUsers: builder.query<IAllUsersAPIResponse, { page?: number; limit?: number; search?: string, user_type?: string } | void>({
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
        updateUser: builder.mutation({
            query: ({ id, payload }: { id: string; payload: FormData }) => ({
                url: `/admin/update-users/${id}`,
                method: 'PUT',
                body: payload,
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
        generatePasswordResetLink: builder.mutation({
            query: (id: string) => ({
                url: `/admin/generate-pasword-reset-link/${id}`,
                method: 'POST',
            }),
        }),

        getRolePermissions: builder.query<IAllRolePermissionsAPIResponse, string>({
            query: (roleId) => ({ url: `/admin/roles/${roleId}/permissions`, method: 'GET' }),
            providesTags: ['AdminPermissions'],
        }),

        addUpdateRolePermissions: builder.mutation({
            query: ({ roleId, data }) => ({ url: `/admin/roles/${roleId}/permissions`, method: 'POST', body: { data } }),
            invalidatesTags: ['AdminPermissions', 'AdminRoles'],
        }),

        getAllPermissions: builder.query<IAllPermissionsAPIResponse, void>({
            query: () => ({ url: `/admin/permissions`, method: 'GET' }),
            providesTags: ['AdminPermissions'],
        }),

        getAllModels: builder.query<IAllModelsAPIResponse, void>({
            query: () => ({ url: `/admin/models`, method: 'GET' }),
            providesTags: ['AdminPermissions'],
        }),

        assignStaffRole: builder.mutation({
            query: ({ staffId, roleId }) => ({ url: `/admin/staff/${staffId}/role`, method: 'PUT', body: { roleId } }),
        }),


    }),
});

export const {
    useGetAllRolesQuery,
    useGetAllUsersQuery,
    useAddRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useGetRolePermissionsQuery,
    useAddUpdateRolePermissionsMutation,
    useGetAllPermissionsQuery,
    useGetAllModelsQuery,
    useAddStaffMutation,
    useUpdateStaffMutation,
    useUpdateUserMutation,
    useUpdateStaffStatusMutation,
    useGeneratePasswordResetLinkMutation,
} = rolesPermissionsApi;
