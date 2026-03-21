'use client';

import { useState, useEffect } from 'react';
import { getAuthToken, getUserRole, getUserDisplayData } from '@/utils/authCookies';

export interface AuthUser {
    fullName: string;
    email: string;
    photo?: string | null;
    role?: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: AuthUser | null;
}

function readAuthState(): AuthState {
    const isAuthenticated = !!getAuthToken();
    if (!isAuthenticated) return { isAuthenticated: false, user: null };

    const display = getUserDisplayData();
    const role = getUserRole();
    return {
        isAuthenticated: true,
        user: {
            fullName: display?.fullName ?? '',
            email: display?.email ?? '',
            photo: display?.photo ?? null,
            role,
        },
    };
}

export function useAuth(): AuthState {
    const [auth, setAuth] = useState<AuthState>(readAuthState);

    useEffect(() => {
        const sync = () => setAuth(readAuthState());
        window.addEventListener('auth-changed', sync);
        return () => window.removeEventListener('auth-changed', sync);
    }, []);

    return auth;
}
