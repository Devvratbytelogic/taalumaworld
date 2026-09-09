'use client';

import { formatOtpResendCountdown } from '@/hooks/useOtpResendCooldown';

type OtpResendButtonProps = {
    remainingSeconds: number;
    isResending: boolean;
    disabled?: boolean;
    onClick: () => void;
    className?: string;
};

export function OtpResendButton({
    remainingSeconds,
    isResending,
    disabled,
    onClick,
    className,
}: OtpResendButtonProps) {
    const isCoolingDown = remainingSeconds > 0;
    const isDisabled = Boolean(disabled || isResending || isCoolingDown);
    const label = isResending
        ? 'Sending...'
        : isCoolingDown
            ? `Resend code in ${formatOtpResendCountdown(remainingSeconds)}`
            : 'Resend code';

    return (
        <button
            type="button"
            className={className}
            onClick={onClick}
            disabled={isDisabled}
            aria-live="polite"
        >
            {label}
        </button>
    );
}
