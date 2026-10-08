/**
 * Central toast helpers.
 * UI code uses Sonner (`toast`); API errors in RTK use HeroUI via `showApiErrorToast`.
 * Identical messages replace the current toast instead of stacking behind it.
 */
import { toast as sonnerToast, Toaster } from 'sonner';
import type { ExternalToast } from 'sonner';
import { addToast } from '@heroui/react';

const API_ERROR_TOAST_MS = 2000;
const recentApiErrorMessages = new Set<string>();

export function showApiErrorToast(message: string) {
    if (!message || recentApiErrorMessages.has(message)) return;

    recentApiErrorMessages.add(message);
    addToast({
        title: 'Error',
        description: message,
        color: 'danger',
        timeout: API_ERROR_TOAST_MS,
    });

    if (typeof window === 'undefined') {
        recentApiErrorMessages.delete(message);
        return;
    }

    window.setTimeout(() => {
        recentApiErrorMessages.delete(message);
    }, API_ERROR_TOAST_MS);
}

type ToastMethod = typeof sonnerToast.success;

function withStableToastId(method: ToastMethod, prefix: string): ToastMethod {
    return ((message, data?: ExternalToast) => {
        const id = data?.id ?? (typeof message === 'string' ? `${prefix}:${message}` : undefined);
        return method(message, { ...data, ...(id !== undefined ? { id } : {}) });
    }) as ToastMethod;
}

const showSuccess = sonnerToast.success.bind(sonnerToast);
const showError = sonnerToast.error.bind(sonnerToast);
const showInfo = sonnerToast.info.bind(sonnerToast);
const showWarning = sonnerToast.warning.bind(sonnerToast);
const showMessage = sonnerToast.message.bind(sonnerToast);

sonnerToast.success = withStableToastId(showSuccess, 'success');
sonnerToast.error = withStableToastId(showError, 'error');
sonnerToast.info = withStableToastId(showInfo, 'info');
sonnerToast.warning = withStableToastId(showWarning, 'warning');
sonnerToast.message = withStableToastId(showMessage, 'message');

export { sonnerToast as toast, sonnerToast as default, Toaster };
