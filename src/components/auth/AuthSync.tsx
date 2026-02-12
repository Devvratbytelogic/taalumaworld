'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setAuthenticated, signOut } from '@/store/slices/authSlice';
import { hasAuthCookie } from '@/utils/auth';

/**
 * Syncs auth state from cookie on mount (client-only).
 * Ensures UI reflects cookie state without a full page reload.
 */
export function AuthSync() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (hasAuthCookie()) {
      dispatch(setAuthenticated());
    } else {
      dispatch(signOut());
    }
  }, [dispatch]);

  return null;
}
