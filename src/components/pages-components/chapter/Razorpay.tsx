'use client';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayPaymentOptions {
  amount: number;
  description: string;
  name?: string;
  onSuccess: (response: RazorpayPaymentResponse) => void;
  onDismiss?: () => void;
}

const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const initiateRazorpayPayment = async (
  options: RazorpayPaymentOptions
): Promise<void> => {
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error('Razorpay SDK failed to load');

  const res = await fetch('/api/razorpay/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: options.amount, currency: 'KES' }),
  });

  if (!res.ok) throw new Error('Failed to create Razorpay order');
  const { orderId, amount } = await res.json();

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount,
      currency: 'KES',
      name: options.name ?? 'Taaluma World',
      description: options.description,
      order_id: orderId,
      handler: (response) => {
        options.onSuccess(response);
        resolve();
      },
      theme: { color: '#7c3aed' },
      modal: {
        ondismiss: () => {
          options.onDismiss?.();
          reject(new Error('Payment dismissed'));
        },
      },
    });
    rzp.open();
  });
};
