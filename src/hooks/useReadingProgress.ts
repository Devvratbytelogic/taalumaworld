'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseReadingProgressOptions {
  enabled?: boolean;
  debounceMs?: number;
}

interface UseReadingProgressResult<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  progress: number;
}

export function useReadingProgress<T extends HTMLElement = HTMLDivElement>({
  enabled = true,
  debounceMs = 150,
}: UseReadingProgressOptions = {}): UseReadingProgressResult<T> {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculateProgress = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // How much of the element's height has scrolled past the top of the viewport.
    const viewedHeight = viewportHeight - rect.top;
    const percentage = (viewedHeight / rect.height) * 100;
    const clamped = Math.min(100, Math.max(0, percentage));

    setProgress((prev) => Math.max(prev, Math.round(clamped)));
  }, []);

  const handleScroll = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(calculateProgress, debounceMs);
  }, [calculateProgress, debounceMs]);

  useEffect(() => {
    if (!enabled) return;

    calculateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [enabled, handleScroll, calculateProgress]);

  return { ref, progress };
}
