'use client';

import { useEffect, useRef } from 'react';
import { Modal, ModalBody, ModalContent } from '@heroui/react';
import { WifiOff, SignalLow, RefreshCw } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { NETWORK_MESSAGES } from '@/utils/network';
import toast from '@/utils/toast';
import Button from '../ui/Button';

export function NetworkStatusBanner() {
  const { quality, slowDismissed, dismissSlowWarning } = useNetworkStatus();
  const wasOfflineRef = useRef(false);

  const isOffline = quality === 'offline';
  const isSlow = quality === 'slow' && !slowDismissed;
  const isOpen = isOffline || isSlow;

  useEffect(() => {
    if (isOffline) {
      wasOfflineRef.current = true;
      return;
    }

    if (wasOfflineRef.current) {
      wasOfflineRef.current = false;
      toast.success(NETWORK_MESSAGES.backOnline, { duration: 3000 });
    }
  }, [isOffline]);

  const content = isOffline
    ? {
        icon: <WifiOff className="h-10 w-10 text-red-500" />,
        iconBg: 'bg-red-50',
        title: 'No internet connection',
        description: NETWORK_MESSAGES.offline,
      }
    : {
        icon: <SignalLow className="h-10 w-10 text-amber-500" />,
        iconBg: 'bg-amber-50',
        title: 'Slow connection',
        description: NETWORK_MESSAGES.slow,
      };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isOffline ? undefined : dismissSlowWarning}
      isDismissable={!isOffline}
      hideCloseButton={isOffline}
      placement="center"
      backdrop="blur"
      classNames={{
        backdrop: 'z-[100]',
        wrapper: 'z-[100]',
      }}
    >
      <ModalContent>
        <ModalBody className="py-8 px-6 text-center">
          <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${content.iconBg}`}>
            {content.icon}
          </div>

          <h2 className="text-xl font-bold mb-2">{content.title}</h2>
          <p className="text-muted-foreground mb-6">{content.description}</p>

          {isOffline ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Waiting for connection…</span>
            </div>
          ) : (
            <Button onPress={dismissSlowWarning} className="global_btn bg_primary w-full">
              Continue anyway
            </Button>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
