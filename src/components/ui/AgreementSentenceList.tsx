'use client';

import { useEffect, useMemo, useRef, useState, type Ref } from 'react';
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
  defaultChecked?: boolean;
  containerRef?: Ref<HTMLDivElement>;
};

function getScrollableYParent(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    const { overflowY } = window.getComputedStyle(parent);
    const canScroll =
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
      parent.scrollHeight > parent.clientHeight + 1;
    if (canScroll) return parent;
    parent = parent.parentElement;
  }
  return null;
}

export function scrollToAgreementSection(element: HTMLElement | null) {
  if (!element) return;

  const scrollParent = getScrollableYParent(element);
  if (scrollParent) {
    const parentRect = scrollParent.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const nextTop = scrollParent.scrollTop + (elementRect.top - parentRect.top) - 12;
    scrollParent.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
    return;
  }

  element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
}

export function AgreementSentenceList({
  touchpoint,
  onAcceptedAgreementIdsChange,
  onRequiredAcceptedChange,
  error,
  touched,
  onBlur,
  disabled,
  className,
  defaultChecked = false,
  containerRef,
}: AgreementSentenceListProps) {
  const { data: sentencesResponse, isSuccess } = useGetAgreementsByTouchpointQuery(touchpoint, {
    skip: !touchpoint,
  });
  const sentences = useMemo(
    () => sentencesResponse?.data?.sentences ?? [],
    [sentencesResponse?.data?.sentences],
  );
  const [checkedSentenceIds, setCheckedSentenceIds] = useState<string[] | null>(null);

  const resolvedCheckedIds = useMemo(() => {
    if (checkedSentenceIds !== null) return checkedSentenceIds;
    if (defaultChecked) return sentences.map((sentence) => sentence._id);
    return [];
  }, [checkedSentenceIds, defaultChecked, sentences]);

  const requiredSentenceIds = useMemo(
    () => sentences.filter((sentence) => sentence.is_required).map((sentence) => sentence._id),
    [sentences],
  );

  const acceptedAgreementIds = useMemo(() => {
    const ids = new Set<string>();
    for (const sentence of sentences) {
      if (!resolvedCheckedIds.includes(sentence._id)) continue;
      for (const link of sentence.links ?? []) {
        if (link.agreement?._id) ids.add(link.agreement._id);
      }
    }
    return Array.from(ids);
  }, [sentences, resolvedCheckedIds]);

  const allRequiredAccepted =
    isSuccess && requiredSentenceIds.every((id) => resolvedCheckedIds.includes(id));
  const acceptedIdsKey = acceptedAgreementIds.join('|');

  const onIdsChangeRef = useRef(onAcceptedAgreementIdsChange);
  const onRequiredChangeRef = useRef(onRequiredAcceptedChange);
  const lastIdsKeyRef = useRef<string | null>(null);
  const lastRequiredRef = useRef<boolean | null>(null);
  onIdsChangeRef.current = onAcceptedAgreementIdsChange;
  onRequiredChangeRef.current = onRequiredAcceptedChange;

  useEffect(() => {
    setCheckedSentenceIds(null);
  }, [touchpoint]);

  useEffect(() => {
    if (lastIdsKeyRef.current === acceptedIdsKey && lastRequiredRef.current === allRequiredAccepted) return;
    lastIdsKeyRef.current = acceptedIdsKey;
    lastRequiredRef.current = allRequiredAccepted;
    onIdsChangeRef.current(acceptedAgreementIds);
    onRequiredChangeRef.current?.(allRequiredAccepted);
  }, [acceptedAgreementIds, acceptedIdsKey, allRequiredAccepted]);

  if (sentences.length === 0) return null;

  return (
    <div ref={containerRef} className={className ?? 'space-y-3'}>
      {sentences.map((sentence) => (
        <AgreementCheckbox
          key={sentence._id}
          id={`sentence-${sentence._id}`}
          checked={resolvedCheckedIds.includes(sentence._id)}
          error={error}
          touched={touched}
          disabled={disabled}
          onCheckedChange={(checked) => {
            setCheckedSentenceIds((prev) => {
              const current = prev ?? (defaultChecked ? sentences.map((item) => item._id) : []);
              return checked
                ? [...current, sentence._id]
                : current.filter((id) => id !== sentence._id);
            });
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
