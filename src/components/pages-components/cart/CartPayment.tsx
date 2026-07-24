'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { AgreementCheckbox } from '@/components/ui/AgreementCheckbox';
import { getPolicyBySlugRoutePath } from '@/routes/routes';
import { useGetAgreementByTouchpointAndUserTypeQuery } from '@/store/rtkQueries/agreementAPIs';
import { AGREEMENT_TOUCHPOINTS, AGREEMENT_VISIBLE_USER_TYPES } from '@/constants/agreements';
import { getUserRole } from '@/utils/authCookies';
import { USER_TYPE } from '@/constants/common';
import { useMpesaPaymentFlow } from '@/hooks/useMpesaPaymentFlow';
import { MpesaPhoneModal } from '@/components/payments/MpesaPhoneModal';
import { MpesaWaitModal } from '@/components/payments/MpesaWaitModal';

interface CartPaymentProps {
  cartId?: string;
  itemCount: number;
  selectedAddressId?: string | null;
  onPaymentSuccess: (result?: { transactionId?: string }) => void;
}

export default function CartPayment({
  cartId,
  itemCount,
  selectedAddressId = null,
  onPaymentSuccess,
}: CartPaymentProps) {
  const [acceptedAgreementIds, setAcceptedAgreementIds] = useState<string[]>([]);
  const [agreementTouched, setAgreementTouched] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);

  const { data: agreementsResponse } = useGetAgreementByTouchpointAndUserTypeQuery({
    touchPoint: AGREEMENT_TOUCHPOINTS.CHECKOUT,
    userType: getUserRole() === USER_TYPE.CAREER_ARCHITECT ? AGREEMENT_VISIBLE_USER_TYPES.CAREER_ARCHITECT : AGREEMENT_VISIBLE_USER_TYPES.INSTITUTIONAL_CA,
  });

  const { startPayment, isInitiating, phoneModalProps, waitModalProps } = useMpesaPaymentFlow({
    cartID: cartId,
    type: 'cart',
    acceptedAgreementIds,
    onSuccess: onPaymentSuccess,
  });

  const checkoutAgreements = agreementsResponse?.data ?? [];
  // Only agreements the API marks as `is_required` must be accepted before checkout.
  const requiredAgreementIds = checkoutAgreements.filter((agreement) => agreement.is_required).map((agreement) => agreement._id);
  const allRequiredAccepted = requiredAgreementIds.every((id) => acceptedAgreementIds.includes(id));
  const hasSelectedAddress = Boolean(selectedAddressId);

  const agreementError =
    agreementTouched && !allRequiredAccepted
      ? 'You must accept all required agreements before checkout'
      : undefined;
  const addressError =
    addressTouched && !hasSelectedAddress
      ? 'Please select a delivery address before payment'
      : undefined;

  const handleCheckout = () => {
    if (!hasSelectedAddress) {
      setAddressTouched(true);
      return;
    }
    if (!allRequiredAccepted) {
      setAgreementTouched(true);
      return;
    }
    startPayment();
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
                  checked ? [...prev, agreement._id] : prev.filter((id) => id !== agreement._id)
                );
                setAgreementTouched(true);
              }}
              onBlur={() => setAgreementTouched(true)}
              disabled={isInitiating}
            >
              {agreement.text}{' '}
              <Link
                href={getPolicyBySlugRoutePath(agreement.slug ?? '')}
                target="_blank"
                className={`font-semibold transition-colors ${agreementError
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

      <Button
        size="lg"
        className="global_btn rounded_full bg_primary h-12 w-full"
        onPress={handleCheckout}
        isDisabled={itemCount === 0 || isInitiating || !hasSelectedAddress}
        startContent={isInitiating ? <Loader2 className="h-5 w-5 animate-spin" /> : undefined}
        endContent={!isInitiating ? <ArrowRight className="h-5 w-5" /> : undefined}
      >
        {isInitiating ? 'Processing...' : 'Pay with M-Pesa'}
      </Button>

      <MpesaPhoneModal {...phoneModalProps} />
      <MpesaWaitModal {...waitModalProps} />
    </>
  );
}
