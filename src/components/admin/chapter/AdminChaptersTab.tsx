import { useState } from 'react';
import { useGetAllChaptersQuery } from '../../../store/api/chaptersApi';
import { useGetAllBooksQuery } from '../../../store/api/booksApi';
import { useGetAuthorsQuery } from '../../../store/api/authorsApi';
import toast from '@/utils/toast';
import { getReadChapterRoutePath } from '@/routes/routes';
import type { Chapter } from '../../../data/mockData';
import { AdminChaptersHeader } from './AdminChaptersHeader';
import { AdminChaptersSearch } from './AdminChaptersSearch';
import { ChapterListing } from './ChapterListing';
import { AddChapterModal } from './AddChapterModal';
import { EditChapterModal } from './EditChapterModal';
import { DeleteChapterDialog } from './DeleteChapterDialog';
import { ChapterPreviewModal } from './ChapterPreviewModal';

export function AdminChaptersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [previewChapter, setPreviewChapter] = useState<Chapter | null>(null);
  const [deleteConfirmChapter, setDeleteConfirmChapter] = useState<Chapter | null>(null);

  const { data: chapters = [] } = useGetAllChaptersQuery();
  const { data: books = [] } = useGetAllBooksQuery();
  const { data: authors = [] } = useGetAuthorsQuery();

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

  const confirmDeleteChapter = () => {
    if (deleteConfirmChapter) {
      toast.success(`"${deleteConfirmChapter.title}" deleted`);
      setDeleteConfirmChapter(null);
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
      />

      <EditChapterModal
        chapter={editingChapter}
        open={!!editingChapter}
        onOpenChange={(open) => !open && setEditingChapter(null)}
        books={books}
        authors={authors}
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
