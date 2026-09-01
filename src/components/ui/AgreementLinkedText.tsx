'use client';

import Link from 'next/link';
import type { IAgreementSentenceLink } from '@/types/agreements';
import { getPolicyBySlugRoutePath } from '@/routes/routes';

type LinkedPhrase = {
  phrase: string;
  slug?: string;
};

function toLinkedPhrases(links?: IAgreementSentenceLink[] | null): LinkedPhrase[] {
  return (links ?? []).map((link) => ({
    phrase: link.phrase,
    slug: link.agreement?.slug || link.slug,
  }));
}

function buildSegments(text: string, phrases: LinkedPhrase[]) {
  const matches: { start: number; end: number; phrase: LinkedPhrase }[] = [];
  for (const item of phrases) {
    if (!item.phrase) continue;
    let from = 0;
    while (from < text.length) {
      const index = text.indexOf(item.phrase, from);
      if (index === -1) break;
      matches.push({ start: index, end: index + item.phrase.length, phrase: item });
      from = index + item.phrase.length;
    }
  }
  matches.sort((a, b) => a.start - b.start || b.end - a.end);

  const picked: typeof matches = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.start < cursor) continue;
    picked.push(match);
    cursor = match.end;
  }

  const segments: { text: string; phrase?: LinkedPhrase }[] = [];
  let last = 0;
  for (const match of picked) {
    if (match.start > last) {
      segments.push({ text: text.slice(last, match.start) });
    }
    segments.push({ text: text.slice(match.start, match.end), phrase: match.phrase });
    last = match.end;
  }
  if (last < text.length) {
    segments.push({ text: text.slice(last) });
  }
  return segments;
}

export function AgreementLinkedText({
  text,
  links,
  className,
}: {
  text: string;
  links?: IAgreementSentenceLink[] | null;
  className?: string;
}) {
  const segments = buildSegments(text, toLinkedPhrases(links));

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (!segment.phrase) return <span key={index}>{segment.text}</span>;
        if (!segment.phrase.slug) {
          return (
            <span key={index} className="underline underline-offset-2">
              {segment.text}
            </span>
          );
        }
        return (
          <Link
            key={index}
            href={getPolicyBySlugRoutePath(segment.phrase.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
            onClick={(e) => e.stopPropagation()}
          >
            {segment.text}
          </Link>
        );
      })}
    </span>
  );
}
