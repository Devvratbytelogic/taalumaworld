'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { BadgeCheck, FileSignature, LogOut } from 'lucide-react';
import Button from '@/components/ui/Button';
import { AgreementLinkedText } from '@/components/ui/AgreementLinkedText';
import toast from '@/utils/toast';
import { useAuth } from '@/hooks/useAuth';
import { getUserRole } from '@/utils/authCookies';
import { signOut } from '@/utils/refreshSession';
import { getAgreementConsentUserType } from '@/constants/agreements';
import {
  useAcceptAgreementMutation,
  useAcceptAllAgreementsMutation,
  useGetUserConsentStatusQuery,
} from '@/store/rtkQueries/agreementAPIs';
import {
  getHomeRoutePath,
  getMentorForgotPasswordRoutePath,
  getMentorLoginRoutePath,
  getMentorSignupRoutePath,
} from '@/routes/routes';
import type { IAgreementSentenceEntity } from '@/types/agreements';
import { getLinkedAgreementIds, isPendingRequiredSentence } from '@/utils/agreementConsent';

function isExemptPath(pathname: string): boolean {
  if (pathname === '/policies' || pathname.startsWith('/policies/')) return true;
  if (pathname.startsWith('/portal/login')) return true;
  if (pathname === getMentorLoginRoutePath() || pathname.startsWith(`${getMentorLoginRoutePath()}/`)) return true;
  if (pathname === getMentorSignupRoutePath() || pathname.startsWith(`${getMentorSignupRoutePath()}/`)) return true;
  if (pathname === getMentorForgotPasswordRoutePath() || pathname.startsWith(`${getMentorForgotPasswordRoutePath()}/`)) {
    return true;
  }
  return false;
}

export function PendingAgreementsGate() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const consentUserType = getAgreementConsentUserType(getUserRole());
  const skip = !isAuthenticated || !consentUserType || isExemptPath(pathname);

  const { data: consentData, isLoading } = useGetUserConsentStatusQuery(
    consentUserType ? { userType: consentUserType } : undefined,
    { skip },
  );
  const [acceptAgreement] = useAcceptAgreementMutation();
  const [acceptAllAgreements] = useAcceptAllAgreementsMutation();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [acceptingAll, setAcceptingAll] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pendingSentences = (consentData?.data?.sentences ?? [])
    .filter(isPendingRequiredSentence)
    .sort((a, b) => a.sort_order - b.sort_order);
  const open = !skip && !isLoading && pendingSentences.length > 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

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
      toast.error('Failed to accept agreement. Please try again.');
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
      toast.error('Failed to accept agreements. Please try again.');
    } finally {
      setAcceptingAll(false);
    }
  };

  const handleSignOut = () => {
    toast.success('Signed out successfully');
    void signOut({ redirectTo: getHomeRoutePath() });
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-400 flex items-center justify-center bg-black/60 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pending-agreements-title"
        className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
              <FileSignature className="h-4 w-4 text-primary" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 id="pending-agreements-title" className="text-base font-semibold text-gray-900">
                Accept remaining agreements
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                You must accept these agreements before you can use the site.
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2 sm:px-6">
          <ul className="divide-y divide-gray-100">
            {pendingSentences.map((sentence) => (
              <li key={sentence._id} className="flex items-start gap-4 py-3.5">
                <p className="min-w-0 flex-1 text-sm leading-6 text-gray-800">
                  <AgreementLinkedText text={sentence.text} links={sentence.links} />
                  {sentence.is_required ? <span className="font-medium text-red-500"> *</span> : null}
                </p>
                <Button
                  type="button"
                  className="global_btn rounded_full bg_primary shrink-0"
                  isLoading={acceptingId === sentence._id}
                  onPress={() => handleAccept(sentence)}
                >
                  Accept
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Button type="button" className="global_btn rounded_full outline_primary" onPress={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
          {pendingSentences.length > 1 ? (
            <Button
              type="button"
              className="global_btn rounded_full bg_primary"
              isLoading={acceptingAll}
              startContent={<BadgeCheck className="h-4 w-4" />}
              onPress={handleAcceptAll}
            >
              Accept all
            </Button>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
