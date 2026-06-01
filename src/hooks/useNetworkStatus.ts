'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getNetworkConnection,
  isBrowserOnline,
  isSlowConnection,
  type NetworkQuality,
} from '@/utils/network';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(() => isBrowserOnline());
  const [isSlow, setIsSlow] = useState(() => isSlowConnection());
  const [slowDismissed, setSlowDismissed] = useState(false);

  const syncConnectionSpeed = useCallback(() => {
    const slow = isSlowConnection();
    setIsSlow(slow);
    if (slow) setSlowDismissed(false);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncConnectionSpeed();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSlowDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = getNetworkConnection();
    connection?.addEventListener('change', syncConnectionSpeed);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      connection?.removeEventListener('change', syncConnectionSpeed);
    };
  }, [syncConnectionSpeed]);

  const quality: NetworkQuality = !isOnline ? 'offline' : isSlow ? 'slow' : 'online';

  return {
    isOnline,
    isSlowConnection: isSlow,
    quality,
    slowDismissed,
    dismissSlowWarning: () => setSlowDismissed(true),
  };
}
