'use client';

import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import BlueprintPublicDetails from '@/components/blueprint/BlueprintPublicDetails';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';
import { useGetSingleChapterQuery } from '@/store/rtkQueries/userGetAPI';

interface MyBlueprintReaderProps {
  chapterId: string;
  onBack: () => void;
}

export default function MyBlueprintReader({ chapterId, onBack }: MyBlueprintReaderProps) {
  const { data: response, isLoading, isError } = useGetSingleChapterQuery(chapterId);
  const chapter = response?.data ?? null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <UserDashboardPageHeader title="Loading blueprint…" description="Preparing your reading view" />
        <div className="animate-pulse space-y-4 rounded-lg border border-gray-200 bg-white p-6">
          <div className="h-4 w-32 rounded bg-gray-100" />
          <div className="h-6 w-2/3 rounded bg-gray-200" />
          <div className="h-40 rounded-lg bg-gray-100" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-gray-100" />
            <div className="h-3 w-5/6 rounded bg-gray-100" />
            <div className="h-3 w-4/6 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !chapter) {
    return (
      <div className="space-y-6">
        <UserDashboardPageHeader
          title="Blueprint unavailable"
          description="We couldn't load this blueprint right now."
        >
          <Button
            type="button"
            className="global_btn rounded_full outline_primary"
            onPress={onBack}
            startContent={<ArrowLeft className="h-4 w-4" />}
          >
            Back to My Blueprints
          </Button>
        </UserDashboardPageHeader>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader
        title={chapter.title}
        description={
          chapter.seriesTitle || chapter.bookTitle
            ? `From ${chapter.seriesTitle || chapter.bookTitle}`
            : `Blueprint ${chapter.blueprintNumber || chapter.chapterNumber}`
        }
      >
        <Button
          type="button"
          className="global_btn rounded_full outline_primary"
          onPress={onBack}
          startContent={<ArrowLeft className="h-4 w-4" />}
        >
          Back to My Blueprints
        </Button>
      </UserDashboardPageHeader>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
        <BlueprintPublicDetails data={{ ...chapter, canRead: true }} embedded />
      </div>
    </div>
  );
}
