'use client';

import { useState } from 'react';
import { AgreementSentenceList } from '@/components/ui/AgreementSentenceList';
import { AGREEMENT_TOUCHPOINTS } from '@/constants/agreements';
import { MpesaPayButton } from '@/components/payments/MpesaPayButton';
import { PaystackPayButton } from '@/components/payments/PaystackPayButton';
import { ReferralWalletPayButton } from '@/components/payments/ReferralWalletPayButton';
// import { useBlockedTouchpoints } from '@/hooks/useBlockedTouchpoints';

interface CartPaymentProps {
  total: number;
  cartId?: string;
  itemCount: number;
  selectedAddressId?: string | null;
  onPaymentSuccess: (result?: { transactionId?: string; orderNumber?: string }) => void;
}

export default function CartPayment({
  total,
  cartId,
  itemCount,
  selectedAddressId = null,
  onPaymentSuccess,
}: CartPaymentProps) {
  const [acceptedAgreementIds, setAcceptedAgreementIds] = useState<string[]>([]);
  const [allRequiredAccepted, setAllRequiredAccepted] = useState(false);
  const [agreementTouched, setAgreementTouched] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);
  const [isMpesaPaying, setIsMpesaPaying] = useState(false);
  const [isWalletPaying, setIsWalletPaying] = useState(false);
  const [isPaystackPaying, setIsPaystackPaying] = useState(false);
  const isPaymentBusy = isMpesaPaying || isWalletPaying || isPaystackPaying;
  // const { isTouchpointBlocked } = useBlockedTouchpoints();
  // const checkoutBlocked = isTouchpointBlocked(AGREEMENT_TOUCHPOINTS.CHECKOUT);

  const hasSelectedAddress = Boolean(selectedAddressId);

  const agreementError =
    agreementTouched && !allRequiredAccepted
      ? 'You must accept all required agreements before checkout'
      : undefined;
  const addressError =
    addressTouched && !hasSelectedAddress
      ? 'Please select a delivery address before payment'
      : undefined;

  const validateCheckout = () => {
    // if (checkoutBlocked) return false;
    if (!hasSelectedAddress) {
      setAddressTouched(true);
      return false;
    }
    if (!allRequiredAccepted) {
      setAgreementTouched(true);
      return false;
    }
    return true;
  };

  const referralWalletPayload = {
    cart_id: cartId,
    type: 'cart',
    accepted_agreement_ids: acceptedAgreementIds,
  };

  return (
    <>
      {/* {checkoutBlocked ? (
        <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Please{' '}
          <Link href={getUserDashboardProfileRoutePath()} className="font-medium underline">
            accept the latest agreements
          </Link>{' '}
          in your profile before checkout.
        </p>
      ) : null} */}

      <div className="mb-4">
        <AgreementSentenceList
          touchpoint={AGREEMENT_TOUCHPOINTS.CHECKOUT}
          onAcceptedAgreementIdsChange={setAcceptedAgreementIds}
          onRequiredAcceptedChange={setAllRequiredAccepted}
          error={agreementError}
          touched={agreementTouched}
          onBlur={() => setAgreementTouched(true)}
          disabled={isPaymentBusy}
        />
      </div>

      {(addressError || !hasSelectedAddress) && (
        <p className={`mb-3 text-sm ${addressError ? 'text-danger' : 'text-muted-foreground'}`}>
          {addressError ?? 'Select a delivery address to continue with payment'}
        </p>
      )}

      <div className="space-y-3">
        <ReferralWalletPayButton
          totalPaymentRequired={total}
          payload={referralWalletPayload}
          isDisabled={itemCount === 0 || isPaymentBusy || !hasSelectedAddress}
          onBeforePay={validateCheckout}
          onSuccess={(res) => {
            const data = (res as { data?: { order_number?: string | number } } | undefined)?.data;
            onPaymentSuccess({
              orderNumber: data?.order_number != null ? String(data.order_number) : undefined,
            });
          }}
          onLoadingChange={setIsWalletPaying}
        />
        <MpesaPayButton
          cartID={cartId}
          type="cart"
          acceptedAgreementIds={acceptedAgreementIds}
          isDisabled={itemCount === 0 || isPaymentBusy || !hasSelectedAddress}
          onBeforePay={validateCheckout}
          onSuccess={onPaymentSuccess}
          onLoadingChange={setIsMpesaPaying}
        />
        <PaystackPayButton
          cartID={cartId}
          type="cart"
          acceptedAgreementIds={acceptedAgreementIds}
          isDisabled={itemCount === 0 || isPaymentBusy || !hasSelectedAddress}
          onBeforePay={validateCheckout}
          onSuccess={onPaymentSuccess}
          onLoadingChange={setIsPaystackPaying}
        />
      </div>
    </>
  );
}
