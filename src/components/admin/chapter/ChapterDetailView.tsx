'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit2, FileText, BookOpen } from 'lucide-react';
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
import { getAdminSectionRoutePath, getEditChapterRoutePath } from '@/routes/routes';

const STATUS_BADGE_CLASS: Record<string, string> = {
  Published: 'bg-green-50 text-green-700 border-green-200',
  Draft: 'bg-yellow-50 text-yellow-700 border-yellow-200',
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

interface ChapterDetailViewProps {
  chapterId: string;
}

export function ChapterDetailView({ chapterId }: ChapterDetailViewProps) {
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

  return (
    <AdminPage>
      <Link
        href={getAdminSectionRoutePath('chapters')}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blueprints
      </Link>

      <AdminPageHeader title="Blueprint details" description="Full details for this blueprint.">
        <Link href={getEditChapterRoutePath(chapter.id)}>
          <Button type="button" className="global_btn rounded_full bg_primary" startContent={<Edit2 className="h-4 w-4" />}>
            Edit Blueprint
          </Button>
        </Link>
      </AdminPageHeader>

      {/* Cover + headline */}
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
              <h3 className="text-xl font-semibold leading-tight">{chapter.title}</h3>
              {chapter.status && (
                <Badge variant="outline" className={`${STATUS_BADGE_CLASS[chapter.status] ?? ''} shrink-0`}>
                  {chapter.status}
                </Badge>
              )}
            </div>

            {chapter.series?.title && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                {chapter.series.title}
              </p>
            )}

            {chapter.isFree ? (
              <div className="pt-1">
                <Badge variant="secondary" className="capitalize">Free Blueprint</Badge>
              </div>
            ) : (
              <p className="text-xl font-bold text-primary pt-1">KSH {Number(chapter.price ?? 0).toFixed(2)}</p>
            )}
          </div>
        </div>
      </AdminPanel>

      {/* Details */}
      <AdminPanel className="p-6">
        <AdminSectionHeader title="Details" />
        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <DetailRow label="Blueprint ID" value={chapter.id} />
          <DetailRow label="Slug" value={chapter.slug} />
          <DetailRow label="Blueprint Number" value={chapter.number} />
          <DetailRow label="Series" value={chapter.series?.title} />
          <DetailRow label="Status" value={chapter.status} />
          <DetailRow label="Free Blueprint" value={chapter.isFree ? 'Yes' : 'No'} />
          <DetailRow label="Price" value={`KSH ${Number(chapter.price ?? 0).toFixed(2)}`} />
          <DetailRow label="Pages" value={chapter.page} />
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
          <DetailRow label="Created" value={moment(chapter.createdAt).format('DD MMM YYYY, hh:mm A')} />
          <DetailRow label="Last Updated" value={moment(chapter.updatedAt).format('DD MMM YYYY, hh:mm A')} />
        </dl>
      </AdminPanel>

      {/* Description */}
      <AdminPanel className="p-6">
        <AdminSectionHeader title="Description" />
        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{chapter.description || '-'}</p>
      </AdminPanel>

      {/* Content */}
      <AdminPanel className="p-6">
        <AdminSectionHeader title="Content" />
        <MarkdownContent content={chapter.content} emptyMessage="No content available." />
      </AdminPanel>

      {/* SEO / Metadata */}
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
        {chapter.json_ld && (
          <div className="mt-5">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1.5">JSON-LD</dt>
            <pre className="rounded-md border border-border bg-muted/50 p-3 text-xs whitespace-pre-wrap wrap-break-word overflow-x-auto">
              {chapter.json_ld}
            </pre>
          </div>
        )}
      </AdminPanel>
    </AdminPage>
  );
}
