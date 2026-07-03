'use client';
import { useState } from 'react';
import { useGetAllAdminChaptersQuery } from '@/store/rtkQueries/adminGetApi';
import { useDeleteChapterMutation } from '@/store/rtkQueries/adminPostApi';
import type { IAllChaptersAPIResponseData } from '@/types/chapter';
import { AdminChaptersHeader } from './AdminChaptersHeader';
import { AdminChaptersSearch } from './AdminChaptersSearch';
import { ChapterListing } from './ChapterListing';
import { DeleteChapterDialog } from './DeleteChapterDialog';
import { ChapterPreviewModal } from './ChapterPreviewModal';
import AdminChaptersSkeleton from '@/components/skeleton-loader/AdminChaptersSkeleton';
import { useDebounce } from '@/hooks/useDebounce';

export function AdminChaptersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const queryParams = {
    page,
    limit: pageLimit,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  };
  const [previewChapter, setPreviewChapter] = useState<IAllChaptersAPIResponseData | null>(null);
  const [deleteConfirmChapter, setDeleteConfirmChapter] = useState<IAllChaptersAPIResponseData | null>(null);

  const { data: chaptersResponse, isLoading, isFetching } = useGetAllAdminChaptersQuery(queryParams);
  const [deleteChapter] = useDeleteChapterMutation();
  const chapters = chaptersResponse?.data ?? [];


  const confirmDeleteChapter = async () => {
    if (!deleteConfirmChapter) return;
    try {
      await deleteChapter({ id: deleteConfirmChapter.id }).unwrap();
      setDeleteConfirmChapter(null);
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };


  return (
    <>
      <div className="space-y-6">
        <AdminChaptersHeader />

        <AdminChaptersSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {isLoading || isFetching ? (
          <AdminChaptersSkeleton />
        ) : (
          <ChapterListing
            data={chapters}
            searchQuery={searchQuery}
            setPreviewChapter={setPreviewChapter}
            setDeleteConfirmChapter={setDeleteConfirmChapter}
          />
        )}

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
    </>
  );
}
