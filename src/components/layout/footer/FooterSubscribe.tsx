'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { AgreementCheckbox } from '@/components/ui/AgreementCheckbox';
import { Input } from '@/components/ui/input';
import { AGREEMENT_TOUCHPOINTS, AGREEMENT_VISIBLE_USER_TYPES } from '@/constants/agreements';
import { USER_TYPE } from '@/constants/common';
import { getPolicyBySlugRoutePath } from '@/routes/routes';
import { useGetAgreementByTouchpointAndUserTypeQuery } from '@/store/rtkQueries/agreementAPIs';
import { useSubscribeToNewsletterMutation } from '@/store/rtkQueries/userPostAPI';
import { getUserRole } from '@/utils/authCookies';
import toast from '@/utils/toast';

function getNewsletterUserType() {
  const role = getUserRole();
  if (role === USER_TYPE.MENTOR) return AGREEMENT_VISIBLE_USER_TYPES.MENTOR;
  if (role === USER_TYPE.INSTITUTIONAL_CAREER_ARCHITECT) {
    return AGREEMENT_VISIBLE_USER_TYPES.INSTITUTIONAL_CA;
  }
  return AGREEMENT_VISIBLE_USER_TYPES.CAREER_ARCHITECT;
}

export default function FooterSubscribe() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [acceptedAgreementIds, setAcceptedAgreementIds] = useState<string[]>([]);
  const [agreementTouched, setAgreementTouched] = useState(false);
  const [subscribeToNewsletter, { isLoading: isSubscribing }] = useSubscribeToNewsletterMutation();

  const { data: agreementsResponse } = useGetAgreementByTouchpointAndUserTypeQuery({
    touchPoint: AGREEMENT_TOUCHPOINTS.NEWSLETTER,
    userType: getNewsletterUserType(),
  });

  const agreements = agreementsResponse?.data ?? [];
  const agreementIds = agreements.map((agreement) => agreement._id);
  const agreementIdsKey = agreementIds.join('|');
  const requiredAgreementIds = agreements
    .filter((agreement) => agreement.is_required)
    .map((agreement) => agreement._id);
  const allRequiredAccepted = requiredAgreementIds.every((id) => acceptedAgreementIds.includes(id));
  const hasEmailError = emailTouched && !newsletterEmail.trim();
  const agreementError =
    agreementTouched && !allRequiredAccepted
      ? 'Please accept all required agreements before subscribing.'
      : undefined;

  // Default-check all newsletter agreements once they load.
  useEffect(() => {
    if (!agreementIdsKey) return;
    setAcceptedAgreementIds(agreementIdsKey.split('|'));
  }, [agreementIdsKey]);

  const handleSubscribe = async () => {
    const email = newsletterEmail.trim();
    if (!email) {
      setEmailTouched(true);
      return;
    }
    if (!allRequiredAccepted) {
      setAgreementTouched(true);
      return;
    }

    try {
      const res = await subscribeToNewsletter({
        email,
        accepted_agreement_ids: acceptedAgreementIds,
        send_updates: acceptedAgreementIds.length > 0,
      }).unwrap();

      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'Subscribed successfully!');
        setNewsletterEmail('');
        setEmailTouched(false);
        setAcceptedAgreementIds(agreementIds);
        setAgreementTouched(false);
      }
    } catch {
      toast.error('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-white">Subscribe to The Taaluma Signal</p>
      <div className="flex gap-2">
        <Input
          placeholder="Your email"
          type="email"
          value={newsletterEmail}
          onChange={(e) => setNewsletterEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          aria-invalid={hasEmailError}
          className={`bg-gray-800 h-auto text-white placeholder:text-gray-500 ${
            hasEmailError ? 'border-red-500! focus-visible:border-red-500!' : 'border-gray-700'
          }`}
        />
        <Button
          className="global_btn rounded_full bg_primary"
          disabled={isSubscribing}
          onPress={handleSubscribe}
        >
          {isSubscribing ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>

      {agreements.length > 0 && (
        <div className="space-y-3 [&_label]:text-gray-300 [&_label_.text-muted-foreground]:text-gray-500">
          {agreements.map((agreement) => (
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
              disabled={isSubscribing}
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
    </div>
  );
}
