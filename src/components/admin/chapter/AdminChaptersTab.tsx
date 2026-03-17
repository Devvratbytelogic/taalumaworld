import { useState } from 'react';
import { useGetAllChaptersQuery } from '@/store/rtkQueries/adminGetApi';
import { useDeleteChapterMutation } from '@/store/rtkQueries/adminPostApi';
import type { IAllChaptersAPIResponseData } from '@/types/chapter';
import { AdminChaptersHeader } from './AdminChaptersHeader';
import { AdminChaptersSearch } from './AdminChaptersSearch';
import { ChapterListing } from './ChapterListing';
import { DeleteChapterDialog } from './DeleteChapterDialog';
import { ChapterPreviewModal } from './ChapterPreviewModal';

export function AdminChaptersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewChapter, setPreviewChapter] = useState<IAllChaptersAPIResponseData | null>(null);
  const [deleteConfirmChapter, setDeleteConfirmChapter] = useState<IAllChaptersAPIResponseData | null>(null);

  const { data: chaptersResponse } = useGetAllChaptersQuery();
  const [deleteChapter] = useDeleteChapterMutation();
  const chapters = chaptersResponse?.data ?? [];

  const confirmDeleteChapter = async () => {
    if (!deleteConfirmChapter) return;
    try {
      await deleteChapter({ id: deleteConfirmChapter.id }).unwrap();
      setDeleteConfirmChapter(null);
    } catch {
      // Error can be handled via toast or inline UI
    }
  };


  return (
    <div className="space-y-8">
      <AdminChaptersHeader />

      <AdminChaptersSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ChapterListing
        data={chapters}
        setPreviewChapter={setPreviewChapter}
        setDeleteConfirmChapter={setDeleteConfirmChapter}
      />

      <ChapterPreviewModal
        chapter={previewChapter}
        open={!!previewChapter}
        onOpenChange={(open) => !open && setPreviewChapter(null)}
      />

      <DeleteChapterDialog
        chapter={deleteConfirmChapter}
        open={!!deleteConfirmChapter}
        onOpenChange={(open) => !open && setDeleteConfirmChapter(null)}
        onConfirm={confirmDeleteChapter}
      />
    </div>
  );
}
