import { useState } from 'react';
import { useGetAllBooksQuery } from '../../../store/api/booksApi';
import { useGetAuthorsQuery } from '../../../store/api/authorsApi';
import { useGetCategoriesQuery } from '../../../store/api/categoriesApi';
import toast from '@/utils/toast';
import { getBooksRoutePath } from '@/routes/routes';
import type { Book as BookType } from '../../../data/mockData';
import { AdminBooksHeader } from './AdminBooksHeader';
import { AdminBooksSearch } from './AdminBooksSearch';
import { BookListing } from './BookListing';
import { AddBookModal } from './AddBookModal';
import { EditBookModal } from './EditBookModal';
import { DeleteBookDialog } from './DeleteBookDialog';

export function AdminBooksTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookType | null>(null);
  const [deleteConfirmBook, setDeleteConfirmBook] = useState<BookType | null>(null);

  const { data: books = [] } = useGetAllBooksQuery();
  const { data: authors = [] } = useGetAuthorsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditBook = (book: BookType) => {
    setEditingBook(book);
  };

  const handleDeleteBook = (book: BookType) => {
    setDeleteConfirmBook(book);
  };

  const confirmDeleteBook = () => {
    if (deleteConfirmBook) {
      toast.success(`"${deleteConfirmBook.title}" deleted`);
      setDeleteConfirmBook(null);
    }
  };

  const openPreview = (book: BookType) => {
    window.open(getBooksRoutePath({ id: book.id }), '_blank');
  };

  return (
    <div className="space-y-8">
      <AdminBooksHeader onCreateBook={() => setIsCreateModalOpen(true)} />

      <AdminBooksSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <BookListing
        books={filteredBooks}
        authors={authors}
        categories={categories}
        searchQuery={searchQuery}
        onCreateBook={() => setIsCreateModalOpen(true)}
        onPreview={openPreview}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
      />

      <AddBookModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        authors={authors}
        categories={categories}
      />

      <EditBookModal
        book={editingBook}
        open={!!editingBook}
        onOpenChange={(open) => !open && setEditingBook(null)}
        authors={authors}
        categories={categories}
      />

      <DeleteBookDialog
        book={deleteConfirmBook}
        open={!!deleteConfirmBook}
        onOpenChange={(open) => !open && setDeleteConfirmBook(null)}
        onConfirm={confirmDeleteBook}
      />
    </div>
  );
}
