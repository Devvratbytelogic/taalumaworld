'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Edit2, FileText, BookOpen, Flag } from 'lucide-react';
import moment from 'moment';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import ImageComponent from '@/components/ui/ImageComponent';
import MarkdownContent from '@/components/ui/MarkdownContent';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminSectionHeader,
} from '@/components/admin/layout/AdminContent';
import { useGetChapterByIdQuery } from '@/store/rtkQueries/adminGetApi';
import { getChaptersListRoutePath, getEditChapterRoutePath, getMentorRoutePath } from '@/routes/routes';
import { BLUEPRINT_STATUS_CONFIG, type BlueprintStatus } from '@/constants/blueprint';
import type { AiCriteria } from '@/types/singleChapter';

const AI_CRITERIA_LABELS: Record<keyof AiCriteria, string> = {
  authenticity: 'Authenticity',
  storytelling: 'Storytelling',
  educational_value: 'Educational value',
  career_insight: 'Career insight',
  actionability: 'Actionability',
  originality: 'Originality',
  taaluma_fit: 'Taaluma fit',
};

function DetailRow({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-slate-700 wrap-break-word">
        {value === undefined || value === null || value === '' ? '-' : value}
      </dd>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return undefined;
  return moment(value).format('DD MMM YYYY, hh:mm A');
}

function formatFlagType(value: string) {
  return value
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

interface ChapterDetailViewProps {
  chapterId: string;
}

export function ChapterDetailView({ chapterId }: ChapterDetailViewProps) {
  const pathname = usePathname();
  const isMentor = pathname.startsWith(getMentorRoutePath());
  const { data, isLoading } = useGetChapterByIdQuery(chapterId);
  const chapter = data?.data;

  if (isLoading) {
    return (
      <AdminPage>
        <AdminPanel className="p-10 text-center text-sm text-slate-500">Loading blueprint...</AdminPanel>
      </AdminPage>
    );
  }

  if (!chapter) {
    return (
      <AdminPage>
        <AdminPanel className="p-10 text-center text-sm text-slate-500">Blueprint not found.</AdminPanel>
      </AdminPage>
    );
  }

  const statusConfig = BLUEPRINT_STATUS_CONFIG[chapter.status as BlueprintStatus];
  const flagTypes = (chapter.contentFlagTypes ?? []).filter((type): type is string => Boolean(type));
  const criteriaEntries = (Object.keys(AI_CRITERIA_LABELS) as (keyof AiCriteria)[])
    .map((key) => ({
      key,
      label: AI_CRITERIA_LABELS[key],
      value: chapter.aiCriteria?.[key],
    }))
    .filter((entry) => entry.value != null);

  return (
    <AdminPage>
      <Link
        href={getChaptersListRoutePath(isMentor)}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blueprints
      </Link>

      <AdminPageHeader title="Blueprint details" description="Full details for this blueprint.">
        <Link href={getEditChapterRoutePath(chapter.id, isMentor)}>
          <Button type="button" className="global_btn rounded_full bg_primary" startContent={<Edit2 className="h-4 w-4" />}>
            Edit Blueprint
          </Button>
        </Link>
      </AdminPageHeader>

      <AdminPanel className="p-6">
        <div className="flex gap-5">
          {chapter.coverImage ? (
            <div className="rounded-2xl overflow-hidden bg-muted border border-border w-32 aspect-3/4 shrink-0">
              <ImageComponent src={chapter.coverImage} alt={chapter.title} object_cover={true} />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-muted-foreground/30 w-32 aspect-3/4 shrink-0 flex items-center justify-center bg-muted/30">
              <span className="text-xs text-muted-foreground px-2 text-center">No cover</span>
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-xl font-semibold leading-tight">{chapter.title}</h3>
                {/* {chapter.short_code ? (
                  <p className="mt-1 font-mono text-xs text-slate-400">{chapter.short_code}</p>
                ) : null} */}
              </div>
              {chapter.status ? (
                <Badge
                  variant="outline"
                  className={`${statusConfig?.badge ?? ''} shrink-0`}
                >
                  {chapter.status}
                </Badge>
              ) : null}
            </div>

            {chapter.series?.title ? (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                {chapter.series.title}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {chapter.isFree ? (
                <Badge variant="secondary">Free Blueprint</Badge>
              ) : (
                <p className="text-xl font-bold text-primary">KSH {Number(chapter.price ?? 0).toFixed(2)}</p>
              )}
              {chapter.isContentFlagged ? (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200! gap-1">
                  <Flag className="h-3 w-3" />
                  Content flagged
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel className="p-6">
        <AdminSectionHeader title="Details" />
        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {/* <DetailRow label="Blueprint ID" value={chapter.id} /> */}
          {/* <DetailRow label="Short code" value={chapter.short_code} /> */}
          <DetailRow label="Slug" value={chapter.slug} />
          <DetailRow label="Blueprint Number" value={chapter.number} />
          <DetailRow label="Series" value={chapter.series?.title} />
          <DetailRow label="Series slug" value={chapter.series?.slug} />
          <DetailRow label="Status" value={chapter.status} />
          <DetailRow label="Free Blueprint" value={chapter.isFree ? 'Yes' : 'No'} />
          <DetailRow label="Price" value={`KSH ${Number(chapter.price ?? 0).toFixed(2)}`} />
          {/* <DetailRow label="Pages" value={chapter.page} /> */}
          <DetailRow
            label="PDF Attachment"
            value={
              chapter.pdf ? (
                <a
                  href={chapter.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline"
                >
                  <FileText className="h-3.5 w-3.5" />
                  View PDF
                </a>
              ) : null
            }
          />
          <DetailRow label="Created" value={formatDate(chapter.createdAt)} />
          <DetailRow label="Last Updated" value={formatDate(chapter.updatedAt)} />
          <DetailRow label="Deleted at" value={formatDate(chapter.deletedAt)} />
        </dl>
      </AdminPanel>

      <AdminPanel className="p-6">
        <AdminSectionHeader
          title="AI review"
          action={
            <Badge
              variant="outline"
              className={
                chapter.isPublishAllowed
                  ? 'bg-green-50 text-green-700 border-green-200!'
                  : 'bg-amber-50 text-amber-700 border-amber-200!'
              }
            >
              {chapter.isPublishAllowed ? 'Publish allowed' : 'Publish not allowed'}
            </Badge>
          }
        />
        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <DetailRow label="AI score" value={chapter.aiScore ?? undefined} />
          {/* <DetailRow label="Classification" value={chapter.aiClassification} /> */}
          <DetailRow label="Scoring status" value={chapter.aiScoringStatus} />
          <DetailRow label="Word count" value={chapter.aiWordCount ?? undefined} />
          <DetailRow label="Scored at" value={formatDate(chapter.aiScoredAt)} />
        </dl>
        {chapter.aiReview ? (
          <div className="mt-5">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1.5">AI review notes</dt>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{chapter.aiReview}</p>
          </div>
        ) : null}
        {criteriaEntries.length > 0 ? (
          <div className="mt-5">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-3">AI criteria</dt>
            <dl className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {criteriaEntries.map((entry) => (
                <DetailRow key={entry.key} label={entry.label} value={entry.value} />
              ))}
            </dl>
          </div>
        ) : null}
      </AdminPanel>

      <AdminPanel className="p-6">
        <AdminSectionHeader title="Content moderation" />
        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <DetailRow label="Content flagged" value={chapter.isContentFlagged ? 'Yes' : 'No'} />
          <DetailRow
            label="Flag types"
            value={
              flagTypes.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {flagTypes.map((type) => (
                    <Badge key={type} variant="outline" className="bg-red-50 text-red-700 border-red-200!">
                      {formatFlagType(type)}
                    </Badge>
                  ))}
                </div>
              ) : undefined
            }
          />
          <DetailRow label="Flagged at" value={formatDate(chapter.contentFlaggedAt)} />
        </dl>
        {chapter.contentFlagDetails ? (
          <div className="mt-5">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1.5">Flag details</dt>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{chapter.contentFlagDetails}</p>
          </div>
        ) : null}
      </AdminPanel>

      <AdminPanel className="p-6">
        <AdminSectionHeader title="Description" />
        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{chapter.description || '-'}</p>
      </AdminPanel>

      <AdminPanel className="p-6">
        <AdminSectionHeader title="Content" />
        <MarkdownContent content={chapter.content} emptyMessage="No content available." />
      </AdminPanel>

      <AdminPanel className="p-6">
        <AdminSectionHeader title="SEO & Metadata" />
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DetailRow label="Meta Title" value={chapter.meta_title} />
          <DetailRow label="Meta Description" value={chapter.meta_description} />
          <DetailRow label="OG Title" value={chapter.og_title} />
          <DetailRow label="OG Description" value={chapter.og_description} />
          <DetailRow
            label="OG Image"
            value={
              chapter.og_image ? (
                <a
                  href={chapter.og_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {chapter.og_image}
                </a>
              ) : null
            }
          />
        </dl>
        {chapter.json_ld ? (
          <div className="mt-5">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1.5">JSON-LD</dt>
            <pre className="rounded-md border border-border bg-muted/50 p-3 text-xs whitespace-pre-wrap wrap-break-word overflow-x-auto">
              {chapter.json_ld}
            </pre>
          </div>
        ) : null}
      </AdminPanel>
    </AdminPage>
  );
}
