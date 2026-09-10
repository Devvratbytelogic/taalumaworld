'use client';

import { useState } from 'react';
import { FileSignature, BadgeCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import { AgreementLinkedText } from '@/components/ui/AgreementLinkedText';
import toast from '@/utils/toast';
import { getLinkedAgreementIds, getTouchpointLabel } from '@/utils/agreementConsent';
import { useGetUserConsentStatusQuery, useAcceptAgreementMutation, useAcceptAllAgreementsMutation } from '@/store/rtkQueries/agreementAPIs';
import { AGREEMENT_VISIBLE_USER_TYPES } from '@/constants/agreements';
import type { IAgreementSentenceEntity } from '@/types/agreements';

interface ProfileAgreementsCardProps {
  userType?: string;
}

export function ProfileAgreementsCard({ userType = AGREEMENT_VISIBLE_USER_TYPES.CAREER_ARCHITECT }: ProfileAgreementsCardProps) {
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [acceptingAll, setAcceptingAll] = useState(false);
  const { data: consentData, isLoading } = useGetUserConsentStatusQuery({ userType });
  const [acceptAgreement] = useAcceptAgreementMutation();
  const [acceptAllAgreements] = useAcceptAllAgreementsMutation();

  const sentences = consentData?.data?.sentences ?? [];
  const acceptedCount = sentences.filter((sentence) => sentence.is_accepted).length;
  const pendingCount = sentences.filter((sentence) => sentence.is_accepted === false).length;

  const handleAccept = async (sentence: IAgreementSentenceEntity) => {
    const acceptedAgreementIds = getLinkedAgreementIds(sentence);
    if (acceptedAgreementIds.length === 0) {
      toast.error('Failed to accept agreement. Please try again.');
      return;
    }
    setAcceptingId(sentence._id);
    try {
      await acceptAgreement({ accepted_agreement_ids: acceptedAgreementIds }).unwrap();
      toast.success('Agreement accepted successfully!');
    } catch {
      // Error toast handled by API layer
    } finally {
      setAcceptingId(null);
    }
  };

  const handleAcceptAll = async () => {
    setAcceptingAll(true);
    try {
      await acceptAllAgreements(undefined).unwrap();
      toast.success('All agreements accepted successfully!');
    } catch {
      // Error toast handled by API layer
    } finally {
      setAcceptingAll(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
            <FileSignature className="h-4 w-4 text-primary" aria-hidden />
          </span>
          <div>
            <h2 className="text-base font-medium text-gray-900">Agreements</h2>
            <p className="mt-0.5 text-xs text-gray-500">Review and accept the agreements required for your account.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isLoading && sentences.length > 0 ? (
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${acceptedCount === sentences.length ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}
            >
              {acceptedCount} of {sentences.length} accepted
            </span>
          ) : null}
          {pendingCount > 0 ? (
            <Button
              type="button"
              className="global_btn rounded_full outline_primary shrink-0"
              isLoading={acceptingAll}
              onPress={handleAcceptAll}
            >
              Accept all
            </Button>
          ) : null}
        </div>
      </div>

      <div className={sentences.length === 0 && !isLoading ? '' : 'px-5 py-4 sm:px-6'}>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-start gap-3 py-3.5">
                <div className="h-9 w-9 shrink-0 rounded-full bg-gray-100" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-3 w-24 rounded bg-gray-50" />
                </div>
                <div className="h-8 w-20 shrink-0 rounded-full bg-gray-100" />
              </div>
            ))}
          </div>
        ) : sentences.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center">
            <FileSignature className="h-8 w-8 text-gray-300" aria-hidden />
            <p className="text-sm font-medium text-gray-900">No agreements found</p>
            <p className="text-xs text-gray-500">There are no agreements required for your account right now.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sentences.map((sentence) => (
              <li key={sentence._id} className="flex items-start gap-3 py-3.5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <FileSignature className="h-4 w-4 text-gray-500" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-6 text-gray-800">
                    <AgreementLinkedText text={sentence.text} links={sentence.links} />
                    {sentence.is_required ? <span className="font-medium text-red-500"> *</span> : null}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{getTouchpointLabel(sentence.touchpoint)}</p>
                </div>
                {sentence.is_accepted ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Accepted
                  </span>
                ) : (
                  <Button
                    type="button"
                    className="global_btn rounded_full bg_primary shrink-0"
                    isLoading={acceptingId === sentence._id}
                    onPress={() => handleAccept(sentence)}
                  >
                    Accept
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
