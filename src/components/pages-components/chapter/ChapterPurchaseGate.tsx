'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { getUserRole } from '@/utils/authCookies';
import { getAgreementConsentUserType } from '@/constants/agreements';
import { useGetUserConsentStatusQuery } from '@/store/rtkQueries/agreementAPIs';
import { isPendingRequiredSentence } from '@/utils/agreementConsent';
import type { ISingleChapterAPIResponseData } from '@/types/user/singleChapter';

interface ChapterPurchaseGateProps {
  isAuthenticated: boolean;
  chapter: ISingleChapterAPIResponseData | null;
  skip?: boolean;
}

/** Renders nothing; opens the ChapterPurchaseModal on mount when a signed-in reader can't yet access this blueprint. */
export default function ChapterPurchaseGate({ isAuthenticated, chapter, skip = false }: ChapterPurchaseGateProps) {
  const dispatch = useDispatch();
  const componentName = useSelector((state: RootState) => state.allModal.componentName);
  const canRead = chapter?.canRead;
  const consentUserType = getAgreementConsentUserType(getUserRole());
  const { data: consentData, isLoading: consentLoading } = useGetUserConsentStatusQuery(
    consentUserType ? { userType: consentUserType } : undefined,
    { skip: !isAuthenticated || !consentUserType },
  );
  const hasPendingAgreements = (consentData?.data?.sentences ?? []).some(isPendingRequiredSentence);
  const waitForConsent = Boolean(consentUserType && (consentLoading || hasPendingAgreements));

  useEffect(() => {
    if (hasPendingAgreements && componentName === 'ChapterPurchaseModal') {
      dispatch(closeModal());
    }
  }, [hasPendingAgreements, componentName, dispatch]);

  useEffect(() => {
    if (skip || waitForConsent) return;
    if (isAuthenticated && chapter && !canRead) {
      dispatch(openModal({ componentName: 'ChapterPurchaseModal', data: { chapter } }));
    }
  }, [isAuthenticated, canRead, chapter, dispatch, skip, waitForConsent]);

  return null;
}
