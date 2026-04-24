import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useMpesaPaymentMutation } from '@/store/rtkQueries/userPostAPI';
import { useLazyGetMpesaPaymentStatusQuery } from '@/store/rtkQueries/userGetAPI';

const DEFAULT_WAIT_SECONDS = 90;
const STATUS_POLL_MS = 2_000;

export type MpesaPayResult = {
  success?: boolean;
  data?: {
    response?: {
      ResponseCode?: string;
      CheckoutRequestID?: string;
      MerchantRequestID?: string;
    };
  };
};

export type MpesaPaymentStatus = 'pending' | 'completed' | 'cancel' | 'failed';

export type MpesaErrorState = {
  title: string;
  description: string;
};

export type UseMpesaPaymentFlowOptions = {
  getAmount: () => number;
  /** @deprecated Phone is now collected via the built-in phone modal. */
  getPhone?: () => number;
  waitSeconds?: number;
  /**
   * Called once when the payment status becomes 'completed'.
   * Should return true if the purchase was successfully finalised on your end.
   */
  attemptComplete: (checkoutRequestId: string) => Promise<boolean>;
  /** Runs once after a successful attemptComplete. */
  onSuccess: () => void | Promise<void>;
};

export function useMpesaPaymentFlow({
  getAmount,
  waitSeconds = DEFAULT_WAIT_SECONDS,
  attemptComplete,
  onSuccess,
}: UseMpesaPaymentFlowOptions) {
  const [mpesaPayment] = useMpesaPaymentMutation();
  const [fetchPaymentStatus] = useLazyGetMpesaPaymentStatusQuery();

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isInitiating, setIsInitiating] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(waitSeconds);
  const [showPaymentSuccessMessage, setShowPaymentSuccessMessage] = useState(false);
  const [errorState, setErrorState] = useState<MpesaErrorState | null>(null);

  const checkoutIdRef = useRef<string | null>(null);
  const finalizedRef = useRef(false);
  /** Prevents overlapping poll() runs. */
  const pollInFlightRef = useRef(false);
  const statusPollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const attemptCompleteRef = useRef(attemptComplete);
  const onSuccessRef = useRef(onSuccess);
  attemptCompleteRef.current = attemptComplete;
  onSuccessRef.current = onSuccess;

  const stopPolling = useCallback(() => {
    if (statusPollIntervalRef.current) {
      clearInterval(statusPollIntervalRef.current);
      statusPollIntervalRef.current = null;
    }
  }, []);

  /** Fully resets everything and closes the wait modal. */
  const cancelWaiting = useCallback(() => {
    finalizedRef.current = true;
    stopPolling();
    checkoutIdRef.current = null;
    setIsWaiting(false);
    setShowPaymentSuccessMessage(false);
    setErrorState(null);
  }, [stopPolling]);

  /**
   * Clears the error and re-opens the phone modal so the user can try again
   * without dismissing the whole flow.
   */
  const retryPayment = useCallback(() => {
    stopPolling();
    checkoutIdRef.current = null;
    finalizedRef.current = false;
    pollInFlightRef.current = false;
    setErrorState(null);
    setShowPaymentSuccessMessage(false);
    setIsWaiting(false);
    setIsPhoneModalOpen(true);
  }, [stopPolling]);

  /** Step 1: open the phone-number modal. */
  const startPayment = useCallback(() => {
    setIsPhoneModalOpen(true);
  }, []);

  /** Step 2: called by MpesaPhoneModal with the collected phone number. */
  const confirmPayment = useCallback(
    async (phone: number) => {
      setIsInitiating(true);
      try {
        const res = (await mpesaPayment({
          amount: getAmount(),
          phone,
        }).unwrap()) as MpesaPayResult;

        const responseCode = res?.data?.response?.ResponseCode;
        const checkoutId = res?.data?.response?.MerchantRequestID;

        if (res?.success && responseCode === '0' && checkoutId) {
          checkoutIdRef.current = checkoutId;
          finalizedRef.current = false;
          pollInFlightRef.current = false;
          setErrorState(null);
          setIsPhoneModalOpen(false);
          setIsWaiting(true);
          setIsInitiating(false);
          return;
        }

        toast.error('Could not start M-Pesa payment', {
          description: 'Please try again or contact support.',
        });
        setIsInitiating(false);
      } catch {
        toast.error('Payment Failed', {
          description: 'Please try again or contact support.',
        });
        setIsInitiating(false);
      }
    },
    [getAmount, mpesaPayment]
  );

  /** Countdown timer — shows progress and times out the wait after waitSeconds. */
  useEffect(() => {
    if (!isWaiting) return;
    setShowPaymentSuccessMessage(false);
    setSecondsLeft(waitSeconds);
    let remaining = waitSeconds;
    const timer = setInterval(() => {
      remaining -= 1;
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        if (!finalizedRef.current) {
          stopPolling();
          setShowPaymentSuccessMessage(false);
          setErrorState({
            title: 'Payment timed out',
            description:
              "We didn't receive a confirmation in time. If you completed the payment on your phone, please contact support.",
          });
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isWaiting, waitSeconds, stopPolling]);

  /**
   * Status polling — hits GET /user/mpaisa/status/:id every 2 seconds.
   *   pending   → keep polling
   *   completed → call attemptComplete, then onSuccess
   *   cancelled → show error in modal and stop
   *   failed    → show error in modal and stop
   *   other     → show error in modal and stop
   */
  useEffect(() => {
    if (!isWaiting) return;
    const checkoutId = checkoutIdRef.current;
    if (!checkoutId) return;

    const pollStatus = async () => {
      if (finalizedRef.current || pollInFlightRef.current) return;
      pollInFlightRef.current = true;
      try {
        const result = await fetchPaymentStatus(checkoutId);
        if (finalizedRef.current) return;

        const status = result?.data?.data?.status as MpesaPaymentStatus | undefined;

        if (status === 'completed') {
          finalizedRef.current = true;
          stopPolling();
          setShowPaymentSuccessMessage(true);
          try {
            const done = await attemptCompleteRef.current(checkoutId);
            checkoutIdRef.current = null;
            setShowPaymentSuccessMessage(false);
            setIsWaiting(false);
            if (done) {
              await Promise.resolve(onSuccessRef.current());
            } else {
              setErrorState({
                title: 'Could not finalise purchase',
                description:
                  'Your payment was received but we could not unlock the chapter. Please contact support.',
              });
              setIsWaiting(true);
            }
          } catch {
            setShowPaymentSuccessMessage(false);
            setErrorState({
              title: 'Could not finalise purchase',
              description:
                'Your payment was received but something went wrong. Please contact support.',
            });
          }
        } else if (status === 'cancel') {
          finalizedRef.current = true;
          stopPolling();
          checkoutIdRef.current = null;
          setErrorState({
            title: 'Payment was cancelled',
            description:
              'You cancelled the M-Pesa prompt. Tap "Try Again" to retry the payment.',
          });
        } else if (status === 'failed') {
          finalizedRef.current = true;
          stopPolling();
          checkoutIdRef.current = null;
          setErrorState({
            title: 'Payment failed',
            description:
              'The M-Pesa transaction could not be completed. Please check your balance and try again.',
          });
        } else if (status && status !== 'pending') {
          finalizedRef.current = true;
          stopPolling();
          checkoutIdRef.current = null;
          setErrorState({
            title: 'Payment was not successful',
            description: 'An unexpected error occurred. Please try again or contact support.',
          });
        }
        // 'pending' → do nothing; next interval will poll again
      } catch {
        // Network/parse error — silently retry on next interval
      } finally {
        pollInFlightRef.current = false;
      }
    };

    void pollStatus();
    statusPollIntervalRef.current = setInterval(() => {
      void pollStatus();
    }, STATUS_POLL_MS);

    return () => stopPolling();
  }, [isWaiting, fetchPaymentStatus, stopPolling]);

  return {
    startPayment,
    confirmPayment,
    cancelWaiting,
    retryPayment,
    isInitiating,
    isWaiting,
    phoneModalProps: {
      isOpen: isPhoneModalOpen,
      onClose: () => setIsPhoneModalOpen(false),
      onConfirm: confirmPayment,
      isLoading: isInitiating,
    },
    waitModalProps: {
      isOpen: isWaiting,
      onClose: cancelWaiting,
      onRetry: retryPayment,
      secondsLeft,
      totalSeconds: waitSeconds,
      showSuccessMessage: showPaymentSuccessMessage,
      errorState,
    },
  };
}
