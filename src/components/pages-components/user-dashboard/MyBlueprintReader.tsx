'use client';

import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import BlueprintPublicDetails from '@/components/blueprint/BlueprintPublicDetails';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';
import type { ItemsEntity } from '@/types/user/myChapters';

interface MyBlueprintReaderProps {
  chapter: ItemsEntity;
  onBack: () => void;
}

export default function MyBlueprintReader({ chapter, onBack }: MyBlueprintReaderProps) {
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
        <BlueprintPublicDetails
          data={{
            id: chapter.chapterId,
            title: chapter.title,
            chapterNumber: chapter.chapterNumber,
            content: chapter.content,
            pdf: chapter.pdf,
            canRead: true,
          }}
          hideMentorDetails={true}
        />
      </div>
    </div>
  );
}
