'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/slices/allModalSlice';

interface LoginRequiredGateProps {
    isAuthenticated: boolean;
    action?: 'cart' | 'read' | 'view' | 'wishlist';
    itemType?: string;
}

/** Renders nothing; opens the LoginRequiredModal on mount when the server-detected auth state is unauthenticated. */
export default function LoginRequiredGate({ isAuthenticated, action = 'view', itemType }: LoginRequiredGateProps) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action, itemType } }));
        }
    }, [isAuthenticated, action, itemType, dispatch]);

    return null;
}
