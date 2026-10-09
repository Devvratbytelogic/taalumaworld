'use client'

import { useState, useEffect } from 'react'
import { getAuthToken, getUserRole, syncUserRoleCookie } from '@/utils/authCookies'
import { useGetUserProfileQuery } from '@/store/rtkQueries/userGetAPI'

export interface AuthUser {
    fullName: string
    email: string
    photo?: string | null
    role?: string
}

export interface AuthState {
    isAuthenticated: boolean
    user: AuthUser | null
}

/** Marketplace session: identity and role come from GET /admin/get-profile. The role cookie is kept in sync for middleware. */
export function useAuth(): AuthState {
    const [, setTick] = useState(0)

    useEffect(() => {
        const sync = () => setTick((t) => t + 1)
        window.addEventListener('auth-changed', sync)
        return () => window.removeEventListener('auth-changed', sync)
    }, [])

    const isAuthenticated = !!getAuthToken()

    const { data: profileRes } = useGetUserProfileQuery(undefined, { skip: !isAuthenticated })
    const profileRole = profileRes?.data?.role?.name

    useEffect(() => {
        if (profileRole) syncUserRoleCookie(profileRole)
    }, [profileRole])

    if (!isAuthenticated) {
        return { isAuthenticated: false, user: null }
    }

    const d = profileRes?.data
    const role = profileRole || getUserRole()

    return {
        isAuthenticated: true,
        user: {
            fullName: d?.name ?? '',
            email: d?.email ?? '',
            photo: d?.profile_pic?.trim() ? d.profile_pic : null,
            role,
        },
    }
}
