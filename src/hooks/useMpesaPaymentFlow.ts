import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useMpesaPaymentMutation } from '@/store/rtkQueries/userPostAPI';

const DEFAULT_PHONE = 254700000000;
const DEFAULT_WAIT_SECONDS = 90;
const DEFAULT_POLL_MS = 10_000;
/** After the wait modal opens, show success UI then call attemptComplete. */
const SUCCESS_THEN_COMPLETE_DELAY_MS = 10_000;

export type MpesaPayResult = {
  success?: boolean;
  data?: {
    response?: {
      ResponseCode?: string;
      CheckoutRequestID?: string;
    };
  };
};

export type UseMpesaPaymentFlowOptions = {
  getAmount: () => number;
  getPhone?: () => number;
  waitSeconds?: number;
  pollIntervalMs?: number;
  /**
   * Called on an interval until it returns true (e.g. chapter unlocked or checkout succeeds).
   */
  attemptComplete: (checkoutRequestId: string) => Promise<boolean>;
  /** Runs once after a successful attemptComplete. */
  onSuccess: () => void | Promise<void>;
};

export function useMpesaPaymentFlow({
  getAmount,
  getPhone,
  waitSeconds = DEFAULT_WAIT_SECONDS,
  pollIntervalMs = DEFAULT_POLL_MS,
  attemptComplete,
  onSuccess,
}: UseMpesaPaymentFlowOptions) {
  const [mpesaPayment] = useMpesaPaymentMutation();
  const [isInitiating, setIsInitiating] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(waitSeconds);
  const [showPaymentSuccessMessage, setShowPaymentSuccessMessage] = useState(false);

  const checkoutIdRef = useRef<string | null>(null);
  const finalizedRef = useRef(false);
  /** Prevents overlapping poll() runs (Strict Mode double-invoke or slow attemptComplete). */
  const pollInFlightRef = useRef(false);
  /** Retries after the first post-10s attempt fails; cleared on success or cancel. */
  const retryPollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptCompleteRef = useRef(attemptComplete);
  const onSuccessRef = useRef(onSuccess);
  attemptCompleteRef.current = attemptComplete;
  onSuccessRef.current = onSuccess;

  const cancelWaiting = useCallback(() => {
    finalizedRef.current = true;
    if (retryPollIntervalRef.current) {
      clearInterval(retryPollIntervalRef.current);
      retryPollIntervalRef.current = null;
    }
    checkoutIdRef.current = null;
    setIsWaiting(false);
    setShowPaymentSuccessMessage(false);
  }, []);

  useEffect(() => {
    if (!isWaiting) return;
    finalizedRef.current = false;
    setShowPaymentSuccessMessage(false);
    setSecondsLeft(waitSeconds);
    let remaining = waitSeconds;
    const timer = setInterval(() => {
      remaining -= 1;
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        if (!finalizedRef.current) {
          if (retryPollIntervalRef.current) {
            clearInterval(retryPollIntervalRef.current);
            retryPollIntervalRef.current = null;
          }
          setShowPaymentSuccessMessage(false);
          toast.error('Payment not confirmed in time', {
            description: 'If you completed the payment on your phone, please check again shortly.',
          });
          setIsWaiting(false);
          checkoutIdRef.current = null;
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isWaiting, waitSeconds]);

  useEffect(() => {
    if (!isWaiting) return;
    const checkoutId = checkoutIdRef.current;
    if (!checkoutId) return;

    const runAttemptComplete = async (): Promise<boolean> => {
      if (finalizedRef.current || pollInFlightRef.current) return false;
      pollInFlightRef.current = true;
      try {
        const done = await attemptCompleteRef.current(checkoutId);
        if (finalizedRef.current) return false;
        if (done) {
          finalizedRef.current = true;
          checkoutIdRef.current = null;
          if (retryPollIntervalRef.current) {
            clearInterval(retryPollIntervalRef.current);
            retryPollIntervalRef.current = null;
          }
          setShowPaymentSuccessMessage(false);
          setIsWaiting(false);
          await Promise.resolve(onSuccessRef.current());
          return true;
        }
      } catch {
        // retry interval may run again
      } finally {
        pollInFlightRef.current = false;
      }
      return false;
    };

    const timeoutId = window.setTimeout(() => {
      if (finalizedRef.current) return;
      setShowPaymentSuccessMessage(true);
      void (async () => {
        await Promise.resolve();
        const ok = await runAttemptComplete();
        if (finalizedRef.current || ok) return;
        setShowPaymentSuccessMessage(false);
        toast.error('Could not confirm payment yet', {
          description: 'We will keep checking for a successful payment.',
        });
        if (retryPollIntervalRef.current) clearInterval(retryPollIntervalRef.current);
        retryPollIntervalRef.current = setInterval(() => {
          void runAttemptComplete();
        }, pollIntervalMs);
      })();
    }, SUCCESS_THEN_COMPLETE_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
      if (retryPollIntervalRef.current) {
        clearInterval(retryPollIntervalRef.current);
        retryPollIntervalRef.current = null;
      }
    };
  }, [isWaiting, pollIntervalMs]);

  const startPayment = useCallback(async () => {
    setIsInitiating(true);
    try {
      const res = (await mpesaPayment({
        amount: getAmount(),
        phone: getPhone?.() ?? DEFAULT_PHONE,
      }).unwrap()) as MpesaPayResult;

      const responseCode = res?.data?.response?.ResponseCode;
      const checkoutId = res?.data?.response?.CheckoutRequestID;

      if (res?.success && responseCode === '0' && checkoutId) {
        checkoutIdRef.current = checkoutId;
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
  }, [getAmount, getPhone, mpesaPayment]);

  return {
    startPayment,
    cancelWaiting,
    isInitiating,
    isWaiting,
    waitModalProps: {
      isOpen: isWaiting,
      onClose: cancelWaiting,
      secondsLeft,
      totalSeconds: waitSeconds,
      showSuccessMessage: showPaymentSuccessMessage,
    },
  };
}
