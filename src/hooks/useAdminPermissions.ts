'use client';

import { useMemo } from 'react';
import { USER_TYPE } from '@/constants/common';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';

/**
 * Admin RBAC: Super Administrator always has full access. Every other role is
 * gated per-model by the `permission` list returned on the admin profile —
 * a model is accessible only if it has at least one permission granted.
 * Individual UI actions are gated with `hasPermission(model, action)`.
 */
export function useAdminPermissions() {
    const { data, isLoading } = useGetAdminProfileQuery();
    const profile = data?.data;
    const isSuperAdmin = profile?.role?.name === USER_TYPE.SUPER_ADMIN;

    const permissionsByModel = useMemo(() => {
        const map = new Map<string, Set<string>>();
        for (const entry of profile?.permission ?? []) {
            const actions = new Set(
                (entry.permission ?? []).map((action) => action.toLowerCase()),
            );
            if (actions.size > 0) {
                map.set(entry.model, actions);
            }
        }
        return map;
    }, [profile?.permission]);

    const hasAccess = (model?: string) => {
        if (!model || isSuperAdmin) return true;
        return permissionsByModel.has(model);
    };

    /** Check a specific action on a model (e.g. hasPermission('Users', 'edit')). */
    const hasPermission = (model: string | undefined, action: string) => {
        if (!model || isSuperAdmin) return true;
        const actions = permissionsByModel.get(model);
        if (!actions) return false;
        return actions.has(action.toLowerCase());
    };

    return { isLoading, isSuperAdmin, hasAccess, hasPermission };
}
