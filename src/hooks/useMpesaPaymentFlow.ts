import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useMpesaPaymentMutation } from '@/store/rtkQueries/userPostAPI';
import { useLazyGetMpesaPaymentStatusQuery } from '@/store/rtkQueries/userGetAPI';
import { mpesaLog } from '@/utils/mpesaLogger';

const DEFAULT_WAIT_SECONDS = 300;
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
  cartID?: string;
  chapterID?: string;
  type?: string;
  /** @deprecated Phone is now collected via the built-in phone modal. */
  getPhone?: () => number;
  waitSeconds?: number;
  /** Called once after the payment status becomes 'completed'. */
  onSuccess: () => void | Promise<void>;
};

const SKIP_MPESA = process.env.NEXT_PUBLIC_SKIP_MPESA === 'true';

export function useMpesaPaymentFlow({
  getAmount,
  cartID,
  chapterID,
  type,
  waitSeconds = DEFAULT_WAIT_SECONDS,
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

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const stopPolling = useCallback(() => {
    if (statusPollIntervalRef.current) {
      clearInterval(statusPollIntervalRef.current);
      statusPollIntervalRef.current = null;
    }
  }, []);

  /** Fully resets everything and closes the wait modal. */
  const cancelWaiting = useCallback(() => {
    mpesaLog('PAYMENT_CANCELLED_BY_USER', 'warn', { checkoutId: checkoutIdRef.current });
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

  /** Step 1: open the phone-number modal (or skip M-Pesa entirely in test mode). */
  const startPayment = useCallback(async () => {
    if (SKIP_MPESA) {
      mpesaLog('TEST_MODE_SKIP', 'warn', { amount: getAmount() });
      setIsInitiating(true);
      try {
        const fakeCheckoutId = `TEST-${Date.now()}`;
        mpesaLog('CHECKOUT_SUCCESS', 'info', { checkoutId: fakeCheckoutId, amount: getAmount() });
        await Promise.resolve(onSuccessRef.current());
      } catch {
        mpesaLog('CHECKOUT_FAILED', 'error', { error: 'Exception thrown in skip-mpesa mode' });
        toast.error('Test purchase error', {
          description: 'An error occurred in skip-mpesa mode.',
        });
      } finally {
        setIsInitiating(false);
      }
      return;
    }
    mpesaLog('PAYMENT_INITIATED', 'info', { amount: getAmount() });
    setIsPhoneModalOpen(true);
  }, [getAmount]);

  /** Step 2: called by MpesaPhoneModal with the collected phone number. */
  const confirmPayment = useCallback(
    async (phone: number) => {
      setIsInitiating(true);
      mpesaLog('PAYMENT_INITIATED', 'info', { amount: getAmount(), phone });
      try {
        const res = (await mpesaPayment({
          amount: getAmount(),
          phone,
          cart_id: cartID,
          chapter_id: chapterID,
          type: type,
        }).unwrap()) as MpesaPayResult;

        const responseCode = res?.data?.response?.ResponseCode;
        const checkoutId = res?.data?.response?.MerchantRequestID;

        if (res?.success && responseCode === '0' && checkoutId) {
          mpesaLog('STK_PUSH_SUCCESS', 'info', {
            checkoutId,
            responseCode,
            amount: getAmount(),
            phone,
            meta: { merchantRequestId: res?.data?.response?.MerchantRequestID, checkoutRequestId: res?.data?.response?.CheckoutRequestID },
          });
          checkoutIdRef.current = checkoutId;
          finalizedRef.current = false;
          pollInFlightRef.current = false;
          setErrorState(null);
          setIsPhoneModalOpen(false);
          setIsWaiting(true);
          setIsInitiating(false);
          return;
        }

        mpesaLog('STK_PUSH_FAILED', 'error', {
          responseCode: responseCode ?? 'none',
          amount: getAmount(),
          phone,
          error: `success=${res?.success}, responseCode=${responseCode}, checkoutId=${checkoutId}`,
        });
        toast.error('Could not start M-Pesa payment', {
          description: 'Please try again or contact support.',
        });
        setIsInitiating(false);
      } catch (err) {
        mpesaLog('STK_PUSH_FAILED', 'error', {
          amount: getAmount(),
          phone,
          error: err instanceof Error ? err.message : 'Unknown exception during STK push',
        });
        toast.error('Payment Failed', {
          description: 'Please try again or contact support.',
        });
        setIsInitiating(false);
      }
    },
    [getAmount, mpesaPayment, cartID, chapterID, type]
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
          mpesaLog('POLL_TIMEOUT', 'warn', {
            checkoutId: checkoutIdRef.current,
            meta: { waitSeconds },
          });
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
   *   completed → call onSuccess (backend handles finalisation)
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

        mpesaLog('POLL_TICK', 'info', { checkoutId, status: status ?? 'undefined' });

        if (status === 'completed') {
          finalizedRef.current = true;
          stopPolling();
          mpesaLog('POLL_COMPLETED', 'info', { checkoutId });
          checkoutIdRef.current = null;
          setShowPaymentSuccessMessage(true);
          await new Promise(resolve => setTimeout(resolve, 1000));
          setShowPaymentSuccessMessage(false);
          setIsWaiting(false);
          mpesaLog('CHECKOUT_SUCCESS', 'info', { checkoutId });
          await Promise.resolve(onSuccessRef.current());
        } else if (status === 'cancel') {
          finalizedRef.current = true;
          stopPolling();
          checkoutIdRef.current = null;
          mpesaLog('POLL_CANCELLED', 'warn', { checkoutId });
          setErrorState({
            title: 'Payment was cancelled',
            description:
              'You cancelled the M-Pesa prompt. Tap "Try Again" to retry the payment.',
          });
        } else if (status === 'failed') {
          finalizedRef.current = true;
          stopPolling();
          checkoutIdRef.current = null;
          mpesaLog('POLL_FAILED', 'error', { checkoutId, status });
          setErrorState({
            title: 'Payment failed',
            description:
              'The M-Pesa transaction could not be completed. Please check your balance and try again.',
          });
        } else if (status && status !== 'pending') {
          finalizedRef.current = true;
          stopPolling();
          checkoutIdRef.current = null;
          mpesaLog('POLL_UNKNOWN_STATUS', 'error', { checkoutId, status });
          setErrorState({
            title: 'Payment was not successful',
            description: 'An unexpected error occurred. Please try again or contact support.',
          });
        }
        // 'pending' → do nothing; next interval will poll again
      } catch (err) {
        // Network/parse error — silently retry on next interval
        mpesaLog('POLL_NETWORK_ERROR', 'error', {
          checkoutId,
          error: err instanceof Error ? err.message : 'Unknown network error during poll',
        });
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
