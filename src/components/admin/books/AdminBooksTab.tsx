import { useState } from 'react';
import { BookOpen, Layers, Users } from 'lucide-react';
import { useGetAllBooksQuery, useGetAllAuthorLeadersQuery, useGetAllCategoriesQuery, } from '@/store/rtkQueries/adminGetApi';
import { useAddBookMutation, useUpdateBookMutation, useDeleteBookMutation } from '@/store/rtkQueries/adminPostApi';
import toast from '@/utils/toast';
import { AdminBooksHeader } from './AdminBooksHeader';
import { AdminBooksSearch } from './AdminBooksSearch';
import { BookListing } from './BookListing';
import { AddBookModal } from './AddBookModal';
import { EditBookModal } from './EditBookModal';
import { DeleteBookDialog } from './DeleteBookDialog';
import { BookPreviewModal } from './BookPreviewModal';
import { IAllBooksAPIResponseDataEntity } from '@/types/books';
import AdminBooksSkeleton from '@/components/skeleton-loader/AdminBooksSkeleton';
import { AdminPage, AdminStatCard } from '@/components/admin/layout/AdminContent';
import { useDebounce } from '@/hooks/useDebounce';

export function AdminBooksTab() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewBook, setPreviewBook] = useState<IAllBooksAPIResponseDataEntity | null>(null);
  const [editingBook, setEditingBook] = useState<IAllBooksAPIResponseDataEntity | null>(null);
  const [deleteConfirmBook, setDeleteConfirmBook] = useState<IAllBooksAPIResponseDataEntity | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLeader, setSelectedLeader] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  const queryParams = {
    page,
    limit: pageLimit,
    ...(selectedCategory ? { category: selectedCategory } : {}),
    ...(selectedLeader ? { leader: selectedLeader } : {}),
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  };
  const { data: booksResponse, isLoading: isBooksLoading, isFetching: isBooksFetching } = useGetAllBooksQuery(queryParams);
  const { data: leadersResponse } = useGetAllAuthorLeadersQuery();
  const { data: categoriesResponse } = useGetAllCategoriesQuery();
  const books = booksResponse?.data ?? [];
  const thoughtLeaders = leadersResponse?.data?.leaders ?? [];
  const categories = categoriesResponse?.data ?? [];

  const [addBook, { isLoading: isAdding }] = useAddBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const categoryOptions = categories.length > 0 ? categories.map((c) => ({ id: c._id, name: c.name })) : [];
  const leaderOptions = thoughtLeaders.length > 0 ? thoughtLeaders.map((l) => ({ id: l._id ?? l.id, name: l.fullName })) : [];


  const hasActiveFilters = !!(selectedCategory || selectedLeader);

  const handleEditBook = (book: IAllBooksAPIResponseDataEntity) => {
    setEditingBook(book);
  };

  const handleDeleteBook = (book: IAllBooksAPIResponseDataEntity) => {
    setDeleteConfirmBook(book);
  };

  const confirmDeleteBook = async () => {
    if (!deleteConfirmBook) return;
    try {
      await deleteBook({ id: deleteConfirmBook._id }).unwrap();
      toast.success(`"${deleteConfirmBook.title}" deleted`);
      setDeleteConfirmBook(null);
    } catch {
      toast.error('Failed to delete series');
    }
  };

  const openPreview = (book: IAllBooksAPIResponseDataEntity) => {
    setPreviewBook(book);
  };

  return (
    <AdminPage>
      <AdminBooksHeader onCreateBook={() => setIsCreateModalOpen(true)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard label="Total Series" value={books?.length ?? 0} icon={BookOpen} tone="blue" />
        <AdminStatCard label="Mentors" value={thoughtLeaders.length} icon={Users} tone="green" />
        <AdminStatCard label="Categories" value={categories.length} icon={Layers} tone="purple" />
      </div>

      <AdminBooksSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categoryOptions}
        leaders={leaderOptions}
        selectedCategory={selectedCategory}
        selectedLeader={selectedLeader}
        onCategoryChange={setSelectedCategory}
        onLeaderChange={setSelectedLeader}
      />

      {isBooksLoading || isBooksFetching ? (
        <AdminBooksSkeleton />
      ) : (
        <BookListing
          books={books}
          totalCount={books?.length ?? 0}
          searchQuery={searchQuery}
          hasActiveFilters={hasActiveFilters}
          onCreateBook={() => setIsCreateModalOpen(true)}
          onPreview={openPreview}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
        />
      )}

      <BookPreviewModal
        book={previewBook}
        open={!!previewBook}
        onOpenChange={(open) => !open && setPreviewBook(null)}
      />

      <AddBookModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        thoughtLeaders={thoughtLeaders}
        categories={categories}
        onSubmit={addBook}
        isSubmitting={isAdding}
      />

      <EditBookModal
        book={editingBook}
        open={!!editingBook}
        onOpenChange={(open) => !open && setEditingBook(null)}
        thoughtLeaders={thoughtLeaders}
        categories={categories}
        onSubmit={updateBook}
        isSubmitting={isUpdating}
      />

      <DeleteBookDialog
        book={deleteConfirmBook}
        open={!!deleteConfirmBook}
        onOpenChange={(open) => !open && setDeleteConfirmBook(null)}
        onConfirm={confirmDeleteBook}
        isDeleting={isDeleting}
      />
    </AdminPage>
  );
}
