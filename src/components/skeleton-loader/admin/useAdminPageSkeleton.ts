'use client';

import { useRef } from 'react';

/** True only for the first fetch on this page mount, so search/filter/paging keep the chrome. */
export function useAdminPageSkeleton(isLoading: boolean, hasData: boolean) {
  const loadedRef = useRef(hasData);
  if (hasData) loadedRef.current = true;
  return isLoading && !loadedRef.current;
}
