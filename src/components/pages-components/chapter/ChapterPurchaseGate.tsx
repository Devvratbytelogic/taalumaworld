'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/slices/allModalSlice';
import type { ISingleChapterAPIResponseData } from '@/types/user/singleChapter';

interface ChapterPurchaseGateProps {
  isAuthenticated: boolean;
  chapter: ISingleChapterAPIResponseData | null;
}

/** Renders nothing; opens the ChapterPurchaseModal on mount when a signed-in reader can't yet access this blueprint. */
export default function ChapterPurchaseGate({ isAuthenticated, chapter }: ChapterPurchaseGateProps) {
  const dispatch = useDispatch();
  const canRead = chapter?.canRead;

  useEffect(() => {
    if (isAuthenticated && chapter && !canRead) {
      dispatch(openModal({ componentName: 'ChapterPurchaseModal', data: { chapter, closeBehavior: 'dismiss' } }));
    }
  }, [isAuthenticated, canRead, chapter, dispatch]);

  return null;
}
