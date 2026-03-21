import { useState } from 'react';
import { useGetAllBooksQuery, useGetAllAuthorLeadersQuery, useGetAllCategoriesQuery, } from '@/store/rtkQueries/adminGetApi';
import { useAddBookMutation, useUpdateBookMutation, useDeleteBookMutation } from '@/store/rtkQueries/adminPostApi';
import toast from '@/utils/toast';
import { getBooksRoutePath } from '@/routes/routes';
import { AdminBooksHeader } from './AdminBooksHeader';
import { AdminBooksSearch } from './AdminBooksSearch';
import { BookListing } from './BookListing';
import { AddBookModal } from './AddBookModal';
import { EditBookModal } from './EditBookModal';
import { DeleteBookDialog } from './DeleteBookDialog';
import { IAllBooksAPIResponseDataEntity } from '@/types/books';
import AdminBooksSkeleton from '@/components/skeleton-loader/AdminBooksSkeleton';

export function AdminBooksTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<IAllBooksAPIResponseDataEntity | null>(null);
  const [deleteConfirmBook, setDeleteConfirmBook] = useState<IAllBooksAPIResponseDataEntity | null>(null);

  const { data: booksResponse, isLoading: isBooksLoading, isFetching: isBooksFetching } = useGetAllBooksQuery();
  const { data: leadersResponse } = useGetAllAuthorLeadersQuery();
  const { data: categoriesResponse } = useGetAllCategoriesQuery();
  const books = booksResponse?.data ?? [];
  const thoughtLeaders = leadersResponse?.data?.leaders ?? [];
  const categories = categoriesResponse?.data ?? [];

  const [addBook, { isLoading: isAdding }] = useAddBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      toast.error('Failed to delete book');
    }
  };

  const openPreview = (book: IAllBooksAPIResponseDataEntity) => {
    window.open(getBooksRoutePath({ id: book.id ?? book._id }), '_blank');
  };

  return (
    <div className="space-y-8">
      <AdminBooksHeader onCreateBook={() => setIsCreateModalOpen(true)} />

      <AdminBooksSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {isBooksLoading || isBooksFetching ? (
        <AdminBooksSkeleton />
      ) : (
        <BookListing
          books={filteredBooks}
          searchQuery={searchQuery}
          onCreateBook={() => setIsCreateModalOpen(true)}
          onPreview={openPreview}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
        />
      )}

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
    </div>
  );
}
