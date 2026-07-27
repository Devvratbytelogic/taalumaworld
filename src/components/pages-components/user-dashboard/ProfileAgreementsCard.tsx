'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileSignature, BadgeCheck, ExternalLink } from 'lucide-react';
import moment from 'moment';
import Button from '@/components/ui/Button';
import toast from '@/utils/toast';
import { useGetUserConsentStatusQuery, useAcceptAgreementMutation } from '@/store/rtkQueries/agreementAPIs';
import { AGREEMENT_VISIBLE_USER_TYPES } from '@/constants/agreements';
import { getPolicyBySlugRoutePath } from '@/routes/routes';

interface ProfileAgreementsCardProps {
  userType?: string;
}

/** Shows the agreements required for the given account type and lets the user accept pending ones. */
export function ProfileAgreementsCard({ userType = AGREEMENT_VISIBLE_USER_TYPES.CAREER_ARCHITECT }: ProfileAgreementsCardProps) {
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const { data: consentData, isLoading } = useGetUserConsentStatusQuery({ userType });
  const [acceptAgreement] = useAcceptAgreementMutation();

  const agreements = consentData?.data?.agreements ?? [];
  const acceptedCount = agreements.filter((agreement) => agreement.is_accepted).length;

  const handleAccept = async (agreementId: string) => {
    setAcceptingId(agreementId);
    try {
      await acceptAgreement({ accepted_agreement_ids: [agreementId] }).unwrap();
      toast.success('Agreement accepted successfully!');
    } catch {
      toast.error('Failed to accept agreement. Please try again.');
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
            <FileSignature className="h-4 w-4 text-primary" aria-hidden />
          </span>
          <div>
            <h2 className="text-base font-medium text-gray-900">Agreements</h2>
            <p className="mt-0.5 text-xs text-gray-500">Review and accept the agreements required for your account.</p>
          </div>
        </div>
        {!isLoading && agreements.length > 0 ? (
          <span
            className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${acceptedCount === agreements.length ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}
          >
            {acceptedCount} of {agreements.length} accepted
          </span>
        ) : null}
      </div>

      <div className={agreements.length === 0 && !isLoading ? '' : 'px-5 py-4 sm:px-6'}>
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-14 animate-pulse rounded-lg bg-gray-100" />
            <div className="h-14 animate-pulse rounded-lg bg-gray-100" />
          </div>
        ) : agreements.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center">
            <FileSignature className="h-8 w-8 text-gray-300" aria-hidden />
            <p className="text-sm font-medium text-gray-900">No agreements found</p>
            <p className="text-xs text-gray-500">There are no agreements required for your account right now.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {agreements.map((agreement) => (
              <li key={agreement._id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <FileSignature className="h-4 w-4 text-gray-500" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {agreement.title} {agreement?.is_required ? <span className="text-xs text-red-500">*</span> : null}
                      </p>
                      {agreement?.slug ? (
                        <Link
                          href={getPolicyBySlugRoutePath(agreement.slug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          View policy
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {agreement.agreement_type?.name ?? 'Agreement'} · v{agreement.current_version}
                      {agreement.is_accepted && agreement.accepted_at
                        ? ` · Accepted ${moment(agreement.accepted_at).format('MMM D, YYYY hh:mm A')}`
                        : ''}
                    </p>
                  </div>
                </div>
                {agreement.is_accepted ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Accepted
                  </span>
                ) : (
                  <Button
                    type="button"
                    className="global_btn rounded_full bg_primary shrink-0"
                    isLoading={acceptingId === agreement._id}
                    onPress={() => handleAccept(agreement._id)}
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
