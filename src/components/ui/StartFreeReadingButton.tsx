'use client';

import { ReactNode } from 'react';
import { BookOpen } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import { AGREEMENT_TOUCHPOINTS } from '@/constants/agreements';
import { VISIBLE } from '@/constants/contentMode';
import { openModal } from '@/store/slices/allModalSlice';
import { useGetAgreementsByTouchpointQuery } from '@/store/rtkQueries/agreementAPIs';
import { rtkQuerieSetup } from '@/store/services/rtkQuerieSetup';
import { usePaystackPaymentMutation } from '@/store/rtkQueries/userPostAPI';
import { getAuthToken } from '@/utils/authCookies';
import { getLinkedAgreementIds } from '@/utils/agreementConsent';

type StartFreeReadingButtonProps = {
  id?: string;
  type?: string;
  label?: string;
  className?: string;
  icon?: ReactNode;
  onLoginCancel?: () => void;
  onSuccess?: () => void;
};

export default function StartFreeReadingButton({
  id,
  type,
  label = 'Start Reading',
  className = 'global_btn rounded_full bg_primary',
  icon,
  onLoginCancel,
  onSuccess,
}: StartFreeReadingButtonProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [paystackPay, { isLoading }] = usePaystackPaymentMutation();
  const { data: agreements, refetch } = useGetAgreementsByTouchpointQuery(AGREEMENT_TOUCHPOINTS.CHECKOUT);

  const startReading = async () => {
    if (!id) return;
    try {
      const sentences = agreements?.data?.sentences
        ?? (await refetch()).data?.data?.sentences
        ?? [];
      const acceptedAgreementIds = [...new Set(sentences.flatMap(getLinkedAgreementIds))];
      const res = await paystackPay({
        type,
        accepted_agreement_ids: acceptedAgreementIds,
        ...(type === VISIBLE.BOOK ? { book_id: id } : { chapter_id: id }),
      }).unwrap();
      // const checkoutUrl = res?.data?.authorization_url || res?.data?.checkout_url;
      // if (checkoutUrl) {
      //   window.location.assign(checkoutUrl);
      //   return;
      // }
      dispatch(rtkQuerieSetup.util.invalidateTags(['SingleChapter', 'AllChapters', 'MyChapters', 'AdminUserConsentStatus']));
      toast.success(res?.message ?? 'You can now read this book.');
      router.refresh();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to start free reading', error);
    }
  };

  const handlePress = () => {
    if (!getAuthToken()) {
      dispatch(openModal({
        componentName: 'SignIn',
        data: {
          onSuccess: startReading,
          ...(onLoginCancel ? { onCancel: onLoginCancel } : {}),
        },
      }));
      return;
    }
    void startReading();
  };

  return (
    <Button
      className={className}
      onPress={handlePress}
      isLoading={isLoading}
      startContent={!isLoading && (icon ?? <BookOpen className="h-4 w-4" />)}
    >
      {label}
    </Button>
  );
}
