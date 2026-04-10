'use client';

import { CheckCircle2 } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress } from '@heroui/react';
import Button from '@/components/ui/Button';

export type MpesaWaitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  secondsLeft: number;
  totalSeconds: number;
  /** Shown after a short delay, before the app confirms the payment server-side. */
  showSuccessMessage?: boolean;
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MpesaWaitModal({
  isOpen,
  onClose,
  secondsLeft,
  totalSeconds,
  showSuccessMessage = false,
}: MpesaWaitModalProps) {
  const progressValue = showSuccessMessage
    ? 100
    : ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      placement="center"
      backdrop="opaque"
      classNames={{
        base: 'max-w-md rounded-3xl z-[10001]',
        wrapper: 'z-[10000]',
        backdrop: 'z-[9999]',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 border-b border-default-100">
          {showSuccessMessage ? (
            <>
              <p className="text-lg font-semibold">Payment successful</p>
              <p className="text-sm font-normal text-muted-foreground">
                Confirming your purchase. Please wait a moment.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold">Complete payment on your phone</p>
              <p className="text-sm font-normal text-muted-foreground">
                Check your M-Pesa prompt and enter your PIN. This window will wait up to{' '}
                {formatTime(totalSeconds)}.
              </p>
            </>
          )}
        </ModalHeader>
        <ModalBody className="py-6 gap-6">
          {showSuccessMessage ? (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <CheckCircle2 className="h-16 w-16 text-success" strokeWidth={1.75} aria-hidden />
              <p className="text-base font-medium text-foreground">M-Pesa payment received</p>
              <p className="text-sm text-muted-foreground">Finalizing your order…</p>
            </div>
          ) : (
            <>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold tabular-nums text-primary">{formatTime(secondsLeft)}</p>
                <p className="text-sm text-muted-foreground">Time remaining</p>
              </div>
              <Progress
                aria-label="Payment wait progress"
                value={progressValue}
                className="max-w-full"
                color="primary"
              />
            </>
          )}
          {showSuccessMessage && (
            <Progress
              aria-label="Confirming payment"
              isIndeterminate
              className="max-w-full"
              color="success"
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            className="global_btn rounded_full outline_primary w-full"
            onPress={onClose}
            isDisabled={showSuccessMessage}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
