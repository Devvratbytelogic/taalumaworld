import { rtkQuerieSetup } from '../services/rtkQuerieSetup';
import type {
    IAllRolesAPIResponse,
    IPermissionsMatrixAPIResponse,
    IAllStaffAPIResponse,
    IAllUserSegmentsAPIResponse,
    IMutationAPIResponse,
    IRoleFormValues,
    IStaffFormValues,
} from '@/types/rolesPermissions';
import {
    DUMMY_ROLES,
    DUMMY_PERMISSIONS_MATRIX,
    DUMMY_STAFF,
    DUMMY_USER_SEGMENTS,
    DUMMY_MUTATION_SUCCESS,
} from '@/app/admin/roles-and-permissions/dummydata';

export const rolesPermissionsApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({

        // ── GET endpoints ──────────────────────────────────────────────────────

        getAllRoles: builder.query<IAllRolesAPIResponse, void>({
            // query: () => ({ url: `/admin/roles`, method: 'GET' }),
            queryFn: () => ({ data: DUMMY_ROLES }),
            providesTags: ['AdminRoles'],
        }),

        getPermissionsMatrix: builder.query<IPermissionsMatrixAPIResponse, void>({
            // query: () => ({ url: `/admin/roles/permissions-matrix`, method: 'GET' }),
            queryFn: () => ({ data: DUMMY_PERMISSIONS_MATRIX }),
            providesTags: ['AdminPermissions'],
        }),

        getAllStaff: builder.query<IAllStaffAPIResponse, void>({
            // query: () => ({ url: `/admin/staff`, method: 'GET' }),
            queryFn: () => ({ data: DUMMY_STAFF }),
            providesTags: ['AdminStaff'],
        }),

        getUserSegments: builder.query<IAllUserSegmentsAPIResponse, void>({
            // query: () => ({ url: `/admin/user-segments`, method: 'GET' }),
            queryFn: () => ({ data: DUMMY_USER_SEGMENTS }),
            providesTags: ['AdminRoles'],
        }),

        // ── Mutation endpoints (UI-only — no data changes) ─────────────────────

        addRole: builder.mutation<IMutationAPIResponse, IRoleFormValues>({
            // query: (payload) => ({ url: `/admin/roles`, method: 'POST', body: payload }),
            queryFn: () => ({ data: DUMMY_MUTATION_SUCCESS }),
        }),

        updateRole: builder.mutation<IMutationAPIResponse, { id: string; values: IRoleFormValues }>({
            // query: ({ id, values }) => ({ url: `/admin/roles/${id}`, method: 'PUT', body: values }),
            queryFn: () => ({ data: DUMMY_MUTATION_SUCCESS }),
        }),

        deleteRole: builder.mutation<IMutationAPIResponse, { id: string }>({
            // query: ({ id }) => ({ url: `/admin/roles/${id}`, method: 'DELETE' }),
            queryFn: () => ({ data: DUMMY_MUTATION_SUCCESS }),
        }),

        updateRolePermissions: builder.mutation<IMutationAPIResponse, { roleId: string; permissionIds: string[] }>({
            // query: ({ roleId, permissionIds }) => ({ url: `/admin/roles/${roleId}/permissions`, method: 'PUT', body: { permissionIds } }),
            queryFn: () => ({ data: DUMMY_MUTATION_SUCCESS }),
        }),

        assignStaffRole: builder.mutation<IMutationAPIResponse, { staffId: string; roleId: string }>({
            // query: ({ staffId, roleId }) => ({ url: `/admin/staff/${staffId}/role`, method: 'PUT', body: { roleId } }),
            queryFn: () => ({ data: DUMMY_MUTATION_SUCCESS }),
        }),

        addStaff: builder.mutation<IMutationAPIResponse, IStaffFormValues>({
            // query: (payload) => ({ url: `/admin/staff`, method: 'POST', body: payload }),
            queryFn: () => ({ data: DUMMY_MUTATION_SUCCESS }),
        }),

        deleteStaff: builder.mutation<IMutationAPIResponse, { id: string }>({
            // query: ({ id }) => ({ url: `/admin/staff/${id}`, method: 'DELETE' }),
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
    useAssignStaffRoleMutation,
    useAddStaffMutation,
    useDeleteStaffMutation,
} = rolesPermissionsApi;
