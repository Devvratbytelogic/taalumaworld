'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useUpdateReadingProgressMutation } from '@/store/rtkQueries/userPostAPI';

interface UseSyncReadingProgressOptions {
  debounceMs?: number;
}

export function useSyncReadingProgress(
  chapterId: string | undefined | null,
  percentage: number,
  { debounceMs = 1000 }: UseSyncReadingProgressOptions = {},
) {
  const { isAuthenticated } = useAuth();
  const [updateReadingProgress] = useUpdateReadingProgressMutation();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    if (!isAuthenticated || !chapterId) return;
    // Progress only ever increases upstream too, so skip no-ops and stale sends.
    if (percentage <= 0 || percentage === lastSentRef.current) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      lastSentRef.current = percentage;
      updateReadingProgress({ chapter_id: chapterId, percentage });
    }, debounceMs);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [isAuthenticated, chapterId, percentage, debounceMs, updateReadingProgress]);
}
