'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { USER_TYPE, isMentorRole } from '@/constants/common';
import { getUserRole } from '@/utils/authCookies';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';

const PROFILE_RETRY_LIMIT = 3;

/**
 * Admin RBAC: Super Administrator and Mentor always have full access.
 * Every other role is gated per-model by the `permission` list returned on
 * the admin profile — a model is accessible only if it has at least one
 * permission granted. Individual UI actions are gated with
 * `hasPermission(model, action)`.
 *
 * Keep identity labels empty until `/admin/get-profile` returns so the chrome
 * does not flash email → real name. Session-cookie Super Administrator / Mentor
 * is used only after that request fails, so the portal cannot collapse into a
 * fake limited staff shell. Staff stay fail-closed until the profile arrives.
 */
export function useAdminPermissions() {
    const { data, isLoading, isUninitialized, isFetching, isError, refetch } = useGetAdminProfileQuery(
        undefined,
        {
            skip: typeof window === 'undefined',
            refetchOnMountOrArgChange: true,
        },
    );
    const profile = data?.data;

    const [sessionRole, setSessionRole] = useState<string | undefined>(undefined);
    const retryAttempt = useRef(0);

    useEffect(() => {
        setSessionRole(getUserRole());
    }, []);

    useEffect(() => {
        if (profile) retryAttempt.current = 0;
    }, [profile]);

    useEffect(() => {
        if (!isError || isFetching || retryAttempt.current >= PROFILE_RETRY_LIMIT) return;
        const timeout = window.setTimeout(() => {
            retryAttempt.current += 1;
            void refetch();
        }, 400 + 700 * retryAttempt.current);
        return () => window.clearTimeout(timeout);
    }, [isError, isFetching, refetch]);

    const isPending = isUninitialized || isLoading || (!profile && isFetching);
    const useSessionFallback = !profile && !isPending;
    const isSuperAdmin =
        profile?.role?.name === USER_TYPE.SUPER_ADMIN ||
        (useSessionFallback && sessionRole === USER_TYPE.SUPER_ADMIN);
    const isMentor =
        profile?.role?.name === USER_TYPE.MENTOR ||
        profile?.user_type === USER_TYPE.MENTOR ||
        (useSessionFallback && isMentorRole(sessionRole));
    const hasFullAccess = isSuperAdmin || isMentor;

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
        if (!model || hasFullAccess) return true;
        if (isPending) return false;
        return permissionsByModel.has(model);
    };

    /** Check a specific action on a model (e.g. hasPermission('Users', 'edit')). */
    const hasPermission = (model: string | undefined, action: string) => {
        if (!model || hasFullAccess) return true;
        if (isPending) return false;
        const actions = permissionsByModel.get(model);
        if (!actions) return false;
        return actions.has(action.toLowerCase());
    };

    const displayName = profile?.name ?? '';
    const roleName = profile?.role?.name ?? '';

    return {
        isLoading: isPending,
        isError,
        refetch,
        isSuperAdmin,
        isMentor,
        hasFullAccess,
        hasAccess,
        hasPermission,
        profile,
        displayName,
        roleName,
    };
}
