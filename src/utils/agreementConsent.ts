import { AGREEMENT_TOUCHPOINT_OPTIONS } from '@/constants/agreements';
import type { IAgreementSentenceEntity } from '@/types/agreements';

export function isPendingRequiredSentence(sentence: IAgreementSentenceEntity): boolean {
  return sentence.is_accepted === false && sentence.is_required;
}

export function getLinkedAgreementIds(sentence: IAgreementSentenceEntity): string[] {
  const ids = new Set<string>();
  for (const link of sentence.links ?? []) {
    if (link.agreement?._id) ids.add(link.agreement._id);
  }
  return Array.from(ids);
}

export function getTouchpointLabel(touchpoint: string): string {
  return AGREEMENT_TOUCHPOINT_OPTIONS.find((option) => option.value === touchpoint)?.label ?? touchpoint;
}
