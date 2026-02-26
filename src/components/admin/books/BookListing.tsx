import { Plus, Book } from 'lucide-react';
import Button from '../../ui/Button';
import { BookCard } from './BookCard';
import type { Book as BookType } from '../../../data/mockData';
import type { Author } from '../../../data/mockData';
import type { Category } from '../../../data/mockData';

interface BookListingProps {
  books: BookType[];
  authors: Author[];
  categories: Category[];
  searchQuery: string;
  onCreateBook: () => void;
  onPreview: (book: BookType) => void;
  onEdit: (book: BookType) => void;
  onDelete: (book: BookType) => void;
}

export function BookListing({
  books,
  authors,
  categories,
  searchQuery,
  onCreateBook,
  onPreview,
  onEdit,
  onDelete,
}: BookListingProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => {
          const author = authors.find((a) => a.id === book.authorId);
          const category = categories.find((c) => c.id === book.categoryId);
          return (
            <BookCard
              key={book.id}
              book={book}
              author={author}
              category={category}
              onPreview={onPreview}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
      </div>

      {books.length === 0 && (
        <div className="bg-white rounded-3xl p-12 shadow-sm">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <Book className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">No books found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Create your first book to get started'}
              </p>
            </div>
            {!searchQuery && (
              <Button
                onPress={onCreateBook}
                className="global_btn rounded_full bg_primary"
                startContent={<Plus className="h-4 w-4" />}
              >
                Create Your First Book
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
