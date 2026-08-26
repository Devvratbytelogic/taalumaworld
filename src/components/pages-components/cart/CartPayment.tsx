'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AgreementCheckbox } from '@/components/ui/AgreementCheckbox';
import { getPolicyBySlugRoutePath } from '@/routes/routes';
import { useGetAgreementByTouchpointAndUserTypeQuery } from '@/store/rtkQueries/agreementAPIs';
import { AGREEMENT_TOUCHPOINTS, AGREEMENT_VISIBLE_USER_TYPES } from '@/constants/agreements';
import { getUserRole } from '@/utils/authCookies';
import { USER_TYPE } from '@/constants/common';
import { MpesaPayButton } from '@/components/payments/MpesaPayButton';
import { PaystackPayButton } from '@/components/payments/PaystackPayButton';
import { ReferralWalletPayButton } from '@/components/payments/ReferralWalletPayButton';

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
  const [agreementTouched, setAgreementTouched] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);
  const [isMpesaPaying, setIsMpesaPaying] = useState(false);
  const [isWalletPaying, setIsWalletPaying] = useState(false);
  const [isPaystackPaying, setIsPaystackPaying] = useState(false);
  const isPaymentBusy = isMpesaPaying || isWalletPaying || isPaystackPaying;

  const { data: agreementsResponse } = useGetAgreementByTouchpointAndUserTypeQuery({
    touchPoint: AGREEMENT_TOUCHPOINTS.CHECKOUT,
    userType:
      getUserRole() === USER_TYPE.CAREER_ARCHITECT
        ? AGREEMENT_VISIBLE_USER_TYPES.CAREER_ARCHITECT
        : AGREEMENT_VISIBLE_USER_TYPES.INSTITUTIONAL_CA,
  });

  const checkoutAgreements = agreementsResponse?.data ?? [];
  // Only agreements the API marks as `is_required` must be accepted before checkout.
  const requiredAgreementIds = checkoutAgreements
    .filter((agreement) => agreement.is_required)
    .map((agreement) => agreement._id);
  const allRequiredAccepted = requiredAgreementIds.every((id) =>
    acceptedAgreementIds.includes(id),
  );
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
      {checkoutAgreements.length > 0 && (
        <div className="mb-4 space-y-3">
          {checkoutAgreements.map((agreement) => (
            <AgreementCheckbox
              key={agreement._id}
              id={agreement._id}
              checked={acceptedAgreementIds.includes(agreement._id)}
              error={agreementError}
              touched={agreementTouched}
              onCheckedChange={(checked) => {
                setAcceptedAgreementIds((prev) =>
                  checked
                    ? [...prev, agreement._id]
                    : prev.filter((id) => id !== agreement._id),
                );
                setAgreementTouched(true);
              }}
              onBlur={() => setAgreementTouched(true)}
              disabled={isPaymentBusy}
            >
              {agreement.text}{' '}
              <Link
                href={getPolicyBySlugRoutePath(agreement.slug ?? '')}
                target="_blank"
                className={`font-semibold transition-colors ${
                  agreementError
                    ? 'text-red-600 hover:text-red-700'
                    : 'text-primary hover:text-primary/80'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {agreement.title}
              </Link>
              {agreement.is_required && <span className="text-red-500"> *</span>}
            </AgreementCheckbox>
          ))}
        </div>
      )}

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
