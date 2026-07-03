import { Plus, BookOpen } from 'lucide-react';
import { Button } from '@heroui/react';
import { BookCard } from './BookCard';
import { AdminEmptyState, AdminPanel } from '@/components/admin/layout/AdminContent';
import type { IAllBooksAPIResponseDataEntity } from '@/types/books';

interface BookListingProps {
  books: IAllBooksAPIResponseDataEntity[];
  totalCount: number;
  searchQuery: string;
  hasActiveFilters: boolean;
  onCreateBook: () => void;
  onPreview: (book: IAllBooksAPIResponseDataEntity) => void;
  onEdit: (book: IAllBooksAPIResponseDataEntity) => void;
  onDelete: (book: IAllBooksAPIResponseDataEntity) => void;
}

export function BookListing({
  books,
  totalCount,
  searchQuery,
  hasActiveFilters,
  onCreateBook,
  onPreview,
  onEdit,
  onDelete,
}: BookListingProps) {
  if (books?.length === 0) {
    return (
      <AdminPanel padding={false}>
        <AdminEmptyState
          icon={BookOpen}
          title="No series found"
          description={
            searchQuery || hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'Create your first series to get started.'
          }
          action={
            !searchQuery && !hasActiveFilters ? (
              <Button
                color="primary"
                className="rounded-xl"
                onPress={onCreateBook}
                startContent={<Plus className="h-4 w-4" />}
              >
                Create series
              </Button>
            ) : undefined
          }
        />
      </AdminPanel>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-900">{books?.length ?? 0}</span>
        {books?.length !== totalCount ? (
          <> of <span className="font-medium text-slate-900">{totalCount}</span></>
        ) : null}{' '}
        series
      </p>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {books?.length > 0 && books?.map((book) => (
          <BookCard
            key={book.id ?? book._id}
            book={book}
            onPreview={onPreview}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
