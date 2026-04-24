'use client';

import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress } from '@heroui/react';
import Button from '@/components/ui/Button';
import type { MpesaErrorState } from '@/hooks/useMpesaPaymentFlow';

export type MpesaWaitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  secondsLeft: number;
  totalSeconds: number;
  /** Shown briefly while the app confirms the payment server-side. */
  showSuccessMessage?: boolean;
  /** When set the modal switches to an error view instead of the timer. */
  errorState?: MpesaErrorState | null;
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MpesaWaitModal({
  isOpen,
  onClose,
  onRetry,
  secondsLeft,
  totalSeconds,
  showSuccessMessage = false,
  errorState = null,
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
      isDismissable={!showSuccessMessage}
      classNames={{
        base: 'max-w-md rounded-3xl z-[10001]',
        wrapper: 'z-[10000]',
        backdrop: 'z-[9999]',
      }}
    >
      <ModalContent>
        {/* ── HEADER ── */}
        <ModalHeader className="flex flex-col gap-1 border-b border-default-100">
          {errorState ? (
            <>
              <p className="text-lg font-semibold text-destructive">{errorState.title}</p>
              <p className="text-sm font-normal text-muted-foreground">{errorState.description}</p>
            </>
          ) : showSuccessMessage ? (
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

        {/* ── BODY ── */}
        <ModalBody className="py-6 gap-6">
          {errorState ? (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-destructive" strokeWidth={1.75} aria-hidden />
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">{errorState.description}</p>
            </div>
          ) : showSuccessMessage ? (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <CheckCircle2 className="h-16 w-16 text-success" strokeWidth={1.75} aria-hidden />
              <p className="text-base font-medium text-foreground">M-Pesa payment received</p>
              <p className="text-sm text-muted-foreground">Finalizing your order…</p>
            </div>
          ) : (
            <>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold tabular-nums text-primary">
                  {formatTime(secondsLeft)}
                </p>
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

        {/* ── FOOTER ── */}
        <ModalFooter className="flex flex-col gap-2">
          {errorState ? (
            <>
              {onRetry && (
                <Button
                  className="global_btn rounded_full bg_primary w-full"
                  onPress={onRetry}
                  startContent={<RefreshCw className="h-4 w-4" />}
                >
                  Try Again
                </Button>
              )}
              <Button
                className="global_btn rounded_full outline_primary w-full"
                onPress={onClose}
              >
                Close
              </Button>
            </>
          ) : (
            <Button
              className="global_btn rounded_full outline_primary w-full"
              onPress={onClose}
              isDisabled={showSuccessMessage}
            >
              Cancel
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
