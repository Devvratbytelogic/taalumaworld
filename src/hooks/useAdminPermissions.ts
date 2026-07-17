'use client';

import { USER_TYPE } from '@/constants/common';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';


/**
 * Admin RBAC: Super Administrator always has full access. Every other role is
 * gated per-model by the `permission` list returned on the admin profile —
 * a model is accessible only if it has at least one permission granted.
 */
export function useAdminPermissions() {
    const { data, isLoading } = useGetAdminProfileQuery();
    const profile = data?.data;
    const isSuperAdmin = profile?.role?.name === USER_TYPE.SUPER_ADMIN;

    const grantedModels = new Set(
        (profile?.permission ?? [])
            .filter((entry) => (entry.permission ?? []).length > 0)
            .map((entry) => entry.model),
    );

    const hasAccess = (model?: string) => {
        if (!model || isSuperAdmin) return true;
        return grantedModels.has(model);
    };

    return { isLoading, isSuperAdmin, hasAccess };
}
