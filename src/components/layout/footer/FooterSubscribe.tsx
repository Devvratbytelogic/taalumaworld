'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { AgreementSentenceList } from '@/components/ui/AgreementSentenceList';
import { Input } from '@/components/ui/input';
import { AGREEMENT_TOUCHPOINTS } from '@/constants/agreements';
import { useSubscribeToNewsletterMutation } from '@/store/rtkQueries/userPostAPI';
import toast from '@/utils/toast';

export default function FooterSubscribe() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [acceptedAgreementIds, setAcceptedAgreementIds] = useState<string[]>([]);
  const [allRequiredAccepted, setAllRequiredAccepted] = useState(false);
  const [agreementTouched, setAgreementTouched] = useState(false);
  const [subscribeToNewsletter, { isLoading: isSubscribing }] = useSubscribeToNewsletterMutation();

  const hasEmailError = emailTouched && !newsletterEmail.trim();
  const agreementError =
    agreementTouched && !allRequiredAccepted
      ? 'Please accept all required agreements before subscribing.'
      : undefined;

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
        setAcceptedAgreementIds([]);
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

      <div className="[&_label]:text-gray-300 [&_label_.text-muted-foreground]:text-gray-500">
        <AgreementSentenceList
          touchpoint={AGREEMENT_TOUCHPOINTS.NEWSLETTER}
          onAcceptedAgreementIdsChange={setAcceptedAgreementIds}
          onRequiredAcceptedChange={setAllRequiredAccepted}
          error={agreementError}
          touched={agreementTouched}
          onBlur={() => setAgreementTouched(true)}
          disabled={isSubscribing}
        />
      </div>
    </div>
  );
}
