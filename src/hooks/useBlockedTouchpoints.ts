'use client';

import { useMemo } from 'react';
import { hasAuthCookie } from '@/utils/authCookies';
import { useGetUserConsentStatusQuery } from '@/store/rtkQueries/agreementAPIs';

export function useBlockedTouchpoints() {
  const isAuthenticated = hasAuthCookie();
  const { data: consentData } = useGetUserConsentStatusQuery(undefined, { skip: !isAuthenticated });

  const blockedTouchpoints = useMemo(() => {
    const blocked = new Set<string>();
    for (const agreement of consentData?.data?.agreements ?? []) {
      if (agreement.can_block && !agreement.is_accepted) {
        for (const touchpoint of agreement.touchpoints ?? []) {
          blocked.add(touchpoint);
        }
      }
    }
    return blocked;
  }, [consentData]);

  const isTouchpointBlocked = (touchpoint: string) => blockedTouchpoints.has(touchpoint);

  return { blockedTouchpoints, isTouchpointBlocked };
}
