'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/slices/allModalSlice';

interface LoginRequiredGateProps {
    isAuthenticated: boolean;
    action?: 'cart' | 'read' | 'view' | 'wishlist';
    itemType?: string;
    skip?: boolean;
}

/** Renders nothing; opens the LoginRequiredModal on mount when the server-detected auth state is unauthenticated. */
export default function LoginRequiredGate({
    isAuthenticated,
    action = 'view',
    itemType,
    skip = false,
}: LoginRequiredGateProps) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (skip || isAuthenticated) return;
        dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action, itemType } }));
    }, [isAuthenticated, action, itemType, dispatch, skip]);

    return null;
}
