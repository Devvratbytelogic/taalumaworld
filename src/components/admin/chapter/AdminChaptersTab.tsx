import { useState, useMemo } from 'react';
import {
  useGetAllChaptersQuery,
  useGetAllBooksQuery,
  useGetAllAuthorLeadersQuery,
} from '@/store/rtkQueries/adminGetApi';
import {
  useAddChapterMutation,
  useUpdateChapterMutation,
  useDeleteChapterMutation,
} from '@/store/rtkQueries/adminPostApi';
import toast from '@/utils/toast';
import { getReadChapterRoutePath } from '@/routes/routes';
import type { Chapter, Book, Author } from '../../../data/mockData';
import type { IAllChaptersAPIResponseDataEntity } from '@/types/chapter';
import { AdminChaptersHeader } from './AdminChaptersHeader';
import { AdminChaptersSearch } from './AdminChaptersSearch';
import { ChapterListing } from './ChapterListing';
import { AddChapterModal } from './AddChapterModal';
import { EditChapterModal } from './EditChapterModal';
import { DeleteChapterDialog } from './DeleteChapterDialog';
import { ChapterPreviewModal } from './ChapterPreviewModal';

function normalizeChapterForListing(c: IAllChaptersAPIResponseDataEntity): Chapter {
  return {
    id: c.id ?? c._id,
    bookId: c.book?._id ?? (c.book as { id?: string })?.id ?? '',
    title: c.title,
    description: c.description ?? '',
    featuredImage: c.coverImage ?? '',
    price: c.price,
    isFree: c.isFree,
    sequence: c.number,
    page: c.page ?? undefined,
    book: c.book ? { title: c.book.title, author: c.book.thoughtLeader ? { name: c.book.thoughtLeader.fullName } : undefined } : undefined,
  } as Chapter;
}

export function AdminChaptersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [previewChapter, setPreviewChapter] = useState<Chapter | null>(null);
  const [deleteConfirmChapter, setDeleteConfirmChapter] = useState<Chapter | null>(null);

  const { data: chaptersResponse } = useGetAllChaptersQuery();
  const { data: booksResponse } = useGetAllBooksQuery();
  const { data: leadersResponse } = useGetAllAuthorLeadersQuery();

  const rawChapters = chaptersResponse?.data ?? [];
  const rawBooks = booksResponse?.data ?? [];
  const leaders = leadersResponse?.data?.leaders ?? [];

  const chapters = useMemo(
    () => rawChapters.map(normalizeChapterForListing),
    [rawChapters]
  );
  const books = useMemo(
    () =>
      rawBooks.map((b) => ({
        ...b,
        id: b.id ?? b._id,
        authorId: b.thoughtLeader?._id ?? (b.thoughtLeader as { id?: string })?.id,
      })) as unknown as Book[],
    [rawBooks]
  );
  const authors = useMemo(
    () => leaders.map((l) => ({ id: l._id, name: l.fullName })) as unknown as Author[],
    [leaders]
  );

  const [addChapter, { isLoading: isAdding }] = useAddChapterMutation();
  const [updateChapter, { isLoading: isUpdating }] = useUpdateChapterMutation();
  const [deleteChapter, { isLoading: isDeleting }] = useDeleteChapterMutation();

  const filteredChapters = chapters.filter(
    (chapter) =>
      chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
  };

  const handleDeleteChapter = (chapter: Chapter) => {
    setDeleteConfirmChapter(chapter);
  };

  const confirmDeleteChapter = async () => {
    if (!deleteConfirmChapter) return;
    try {
      await deleteChapter({ id: deleteConfirmChapter.id }).unwrap();
      toast.success(`"${deleteConfirmChapter.title}" deleted`);
      setDeleteConfirmChapter(null);
    } catch {
      toast.error('Failed to delete chapter');
    }
  };

  const openPreview = (chapter: Chapter) => {
    setPreviewChapter(chapter);
  };

  const openFullPage = (chapter: Chapter) => {
    window.open(getReadChapterRoutePath(chapter.id), '_blank');
  };

  return (
    <div className="space-y-8">
      <AdminChaptersHeader onCreateChapter={() => setIsCreateModalOpen(true)} />

      <AdminChaptersSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ChapterListing
        chapters={filteredChapters}
        books={books}
        authors={authors}
        searchQuery={searchQuery}
        onCreateChapter={() => setIsCreateModalOpen(true)}
        onPreview={openPreview}
        onEdit={handleEditChapter}
        onDelete={handleDeleteChapter}
      />

      <AddChapterModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        books={books}
        authors={authors}
        onSubmit={addChapter}
        isSubmitting={isAdding}
      />

      <EditChapterModal
        chapter={editingChapter}
        open={!!editingChapter}
        onOpenChange={(open) => !open && setEditingChapter(null)}
        books={books}
        authors={authors}
        onSubmit={updateChapter}
        isSubmitting={isUpdating}
      />

      <ChapterPreviewModal
        chapter={previewChapter}
        open={!!previewChapter}
        onOpenChange={(open) => !open && setPreviewChapter(null)}
        books={books}
        authors={authors}
        onOpenFullPage={openFullPage}
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
