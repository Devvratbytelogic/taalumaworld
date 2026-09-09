'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export const OTP_RESEND_COOLDOWN_SECONDS = 2 * 60;

export function formatOtpResendCountdown(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${remaining.toString().padStart(2, '0')}`;
}

export function useOtpResendCooldown() {
    const [remainingSeconds, setRemainingSeconds] = useState(OTP_RESEND_COOLDOWN_SECONDS);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimer = useCallback(() => {
        if (intervalRef.current == null) return;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }, []);

    const startCooldown = useCallback(() => {
        clearTimer();
        setRemainingSeconds(OTP_RESEND_COOLDOWN_SECONDS);
        intervalRef.current = setInterval(() => {
            setRemainingSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
        }, 1000);
    }, [clearTimer]);

    useEffect(() => {
        startCooldown();
        return clearTimer;
    }, [startCooldown, clearTimer]);

    useEffect(() => {
        if (remainingSeconds === 0) clearTimer();
    }, [remainingSeconds, clearTimer]);

    return {
        remainingSeconds,
        canResend: remainingSeconds <= 0,
        startCooldown,
    };
}
