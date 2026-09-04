'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AgreementCheckbox } from '@/components/ui/AgreementCheckbox';
import { AgreementLinkedText } from '@/components/ui/AgreementLinkedText';
import { useGetAgreementsByTouchpointQuery } from '@/store/rtkQueries/agreementAPIs';

type AgreementSentenceListProps = {
  touchpoint: string;
  onAcceptedAgreementIdsChange: (ids: string[]) => void;
  onRequiredAcceptedChange?: (accepted: boolean) => void;
  error?: string;
  touched?: boolean;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
};

export function AgreementSentenceList({
  touchpoint,
  onAcceptedAgreementIdsChange,
  onRequiredAcceptedChange,
  error,
  touched,
  onBlur,
  disabled,
  className,
}: AgreementSentenceListProps) {
  const { data: sentencesResponse, isSuccess } = useGetAgreementsByTouchpointQuery(touchpoint, {
    skip: !touchpoint,
  });
  const sentences = useMemo(
    () => sentencesResponse?.data?.sentences ?? [],
    [sentencesResponse?.data?.sentences],
  );
  const [checkedSentenceIds, setCheckedSentenceIds] = useState<string[]>([]);

  const requiredSentenceIds = useMemo(
    () => sentences.filter((sentence) => sentence.is_required).map((sentence) => sentence._id),
    [sentences],
  );

  const acceptedAgreementIds = useMemo(() => {
    const ids = new Set<string>();
    for (const sentence of sentences) {
      if (!checkedSentenceIds.includes(sentence._id)) continue;
      for (const link of sentence.links ?? []) {
        if (link.agreement?._id) ids.add(link.agreement._id);
      }
    }
    return Array.from(ids);
  }, [sentences, checkedSentenceIds]);

  const allRequiredAccepted =
    isSuccess && requiredSentenceIds.every((id) => checkedSentenceIds.includes(id));
  const acceptedIdsKey = acceptedAgreementIds.join('|');

  const onIdsChangeRef = useRef(onAcceptedAgreementIdsChange);
  const onRequiredChangeRef = useRef(onRequiredAcceptedChange);
  const lastIdsKeyRef = useRef<string | null>(null);
  const lastRequiredRef = useRef<boolean | null>(null);
  onIdsChangeRef.current = onAcceptedAgreementIdsChange;
  onRequiredChangeRef.current = onRequiredAcceptedChange;

  useEffect(() => {
    if (lastIdsKeyRef.current === acceptedIdsKey && lastRequiredRef.current === allRequiredAccepted) return;
    lastIdsKeyRef.current = acceptedIdsKey;
    lastRequiredRef.current = allRequiredAccepted;
    onIdsChangeRef.current(acceptedAgreementIds);
    onRequiredChangeRef.current?.(allRequiredAccepted);
  }, [acceptedAgreementIds, acceptedIdsKey, allRequiredAccepted]);

  if (sentences.length === 0) return null;

  return (
    <div className={className ?? 'space-y-3'}>
      {sentences.map((sentence) => (
        <AgreementCheckbox
          key={sentence._id}
          id={`sentence-${sentence._id}`}
          checked={checkedSentenceIds.includes(sentence._id)}
          error={error}
          touched={touched}
          disabled={disabled}
          onCheckedChange={(checked) => {
            setCheckedSentenceIds((prev) =>
              checked ? [...prev, sentence._id] : prev.filter((id) => id !== sentence._id),
            );
          }}
          onBlur={onBlur}
        >
          <AgreementLinkedText text={sentence.text} links={sentence.links} />
          {sentence.is_required ? <span className="font-medium text-red-500"> *</span> : null}
        </AgreementCheckbox>
      ))}
    </div>
  );
}
