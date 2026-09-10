/**
 * Central toast helpers.
 * UI code uses Sonner (`toast`); API errors in RTK use HeroUI via `showApiErrorToast`.
 * Identical error messages replace/skip instead of stacking.
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

const originalError = sonnerToast.error.bind(sonnerToast);

sonnerToast.error = ((message, data?: ExternalToast) => {
    const id = data?.id ?? (typeof message === 'string' ? `error:${message}` : undefined);
    return originalError(message, { ...data, ...(id !== undefined ? { id } : {}) });
}) as typeof sonnerToast.error;

export { sonnerToast as toast, sonnerToast as default, Toaster };
