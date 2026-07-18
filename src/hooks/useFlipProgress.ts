'use client';

import { useCallback, useRef, useState } from 'react';
import type { FlipProgressInfo } from './useDearFlip';

interface UseFlipProgressOptions {
  /** Delay (ms) used to debounce rapid page flips. Defaults to 200ms. */
  debounceMs?: number;
}

interface UseFlipProgressResult {
  /** How much of the flipbook has been viewed, 0-100. Never decreases. */
  progress: number;
  /** Current page reported by the flipbook (1-indexed). */
  currentPage: number;
  /** Total number of pages in the flipbook. */
  totalPages: number;
  /** Pass this as `onFlip` to `useDearFlip`. */
  onFlip: (info: FlipProgressInfo) => void;
}

/**
 * Tracks what percentage of a DearFlip flipbook's pages have been viewed as
 * the user flips through it. The reported progress only ever increases, even
 * if the user flips back to an earlier page.
 */
export function useFlipProgress({
  debounceMs = 200,
}: UseFlipProgressOptions = {}): UseFlipProgressResult {
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onFlip = useCallback(
    (info: FlipProgressInfo) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        setCurrentPage(info.currentPage);
        setTotalPages(info.totalPages);
        setProgress((prev) => Math.max(prev, info.percentage));
      }, debounceMs);
    },
    [debounceMs],
  );

  return { progress, currentPage, totalPages, onFlip };
}
