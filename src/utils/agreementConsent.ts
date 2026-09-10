import { AGREEMENT_TOUCHPOINT_OPTIONS } from '@/constants/agreements';
import type { IAgreementSentenceEntity, IConsentType } from '@/types/agreements';

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

export function formatConsentType(items?: IConsentType[] | null): string {
  if (!items?.length) return '—';
  return items
    .map((item) => `${item.type} v${item.version} (latest v${item.latest_version})`)
    .join(', ');
}

export function getApiErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    return String((error as { data?: { message?: unknown } }).data?.message ?? '');
  }
  return '';
}
