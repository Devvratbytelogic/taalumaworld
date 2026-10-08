'use client';

import { Download } from 'lucide-react';
import { useGetAdminGlobalSettingsQuery } from '@/store/rtkQueries/adminGetApi';

/** Shown only inside the mentor panel. Hidden when no guide has been uploaded. */
export function MentorGuideDownload() {
  const { data } = useGetAdminGlobalSettingsQuery();
  const guideUrl = data?.data?.mentor_guide;
  if (typeof guideUrl !== 'string' || !guideUrl?.trim()) return null;

  const openGuide = () => {
    window.open(guideUrl || '', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Download className="h-5 w-5 text-primary" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">Writing and publishing guide</p>
        <p className="text-sm text-slate-600">
          Step-by-step help for writing and publishing on Taaluma.
        </p>
      </div>
      <button
        type="button"
        onClick={openGuide}
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Download className="h-4 w-4" />
        Download
      </button>
    </div>
  );
}
