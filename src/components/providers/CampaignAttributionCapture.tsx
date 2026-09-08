'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { captureCampaignAttribution } from '@/utils/campaignAttribution';

/** Runs in the app shell so UTM is captured on first land, not only on register. */
export function CampaignAttributionCapture() {
  const pathname = usePathname();

  useEffect(() => {
    captureCampaignAttribution();
  }, [pathname]);

  return null;
}
