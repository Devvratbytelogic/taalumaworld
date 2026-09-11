'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';

interface LoginRequiredGateProps {
    isAuthenticated: boolean;
    action?: 'cart' | 'read' | 'view' | 'wishlist';
    itemType?: string;
    skip?: boolean;
}

/** Renders nothing; opens the LoginRequiredModal on mount when the reader is unauthenticated. */
export default function LoginRequiredGate({
    isAuthenticated,
    action = 'view',
    itemType,
    skip = false,
}: LoginRequiredGateProps) {
    const dispatch = useDispatch();
    const componentName = useSelector((state: RootState) => state.allModal.componentName);

    useEffect(() => {
        if (skip || isAuthenticated) return;
        dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action, itemType } }));
    }, [isAuthenticated, action, itemType, dispatch, skip]);

    useEffect(() => {
        if (isAuthenticated && componentName === 'LoginRequiredModal') {
            dispatch(closeModal());
        }
    }, [isAuthenticated, componentName, dispatch]);

    return null;
}
