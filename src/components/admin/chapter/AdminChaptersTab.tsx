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

export function AdminChaptersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewChapter, setPreviewChapter] = useState<IAllChaptersAPIResponseData | null>(null);
  const [deleteConfirmChapter, setDeleteConfirmChapter] = useState<IAllChaptersAPIResponseData | null>(null);

  const { data: chaptersResponse, isLoading, isFetching } = useGetAllAdminChaptersQuery();
  const [deleteChapter] = useDeleteChapterMutation();
  const chapters = chaptersResponse?.data ?? [];

  const filteredChapters = chapters.filter((chapter) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      chapter.title?.toLowerCase().includes(q) ||
      chapter.book?.title?.toLowerCase().includes(q) ||
      chapter.book?.thoughtLeader?.fullName?.toLowerCase().includes(q) ||
      chapter.status?.toLowerCase().includes(q) ||
      String(chapter.price).includes(q) ||
      String(chapter.number).includes(q)
    );
  });

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
   <>
      <div className="space-y-8">
        <AdminChaptersHeader />
  
        <AdminChaptersSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
  
        {isLoading || isFetching ? (
          <AdminChaptersSkeleton />
        ) : (
          <ChapterListing
            data={filteredChapters}
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
