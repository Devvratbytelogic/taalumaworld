'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useGetAllBooksQuery, useGetBookByIdQuery } from '@/store/api/booksApi';
import { useGetAuthorsQuery } from '@/store/api/authorsApi';
import { useGetCategoriesQuery } from '@/store/api/categoriesApi';
import { getBooksRoutePath, getHomeRoutePath } from '@/routes/routes';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import ImageComponent from '@/components/ui/ImageComponent';
import { BookOpen, ArrowLeft, User } from 'lucide-react';

export default function BooksPage() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get('id');

  const { data: book, isLoading: isLoadingBook } = useGetBookByIdQuery(bookId ?? '', { skip: !bookId });
  const { data: books = [] } = useGetAllBooksQuery();
  const { data: authors = [] } = useGetAuthorsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();

  // Loading single book
  if (bookId && isLoadingBook) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Single book preview
  if (bookId && book) {
    const author = authors.find((a) => a.id === book.authorId);
    const category = categories.find((c) => c.id === book.categoryId);
    const subcategory = category?.subcategories.find((s) => s.id === book.subcategoryId);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Link
            href={getBooksRoutePath()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Books
          </Link>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="aspect-3/4 rounded-2xl overflow-hidden bg-muted">
                <ImageComponent
                  src={book.coverImage}
                  alt={book.title}
                  object_cover={true}
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex flex-wrap gap-2">
                  {category && (
                    <Badge variant="outline">{category.name}</Badge>
                  )}
                  {subcategory && (
                    <Badge variant="outline">{subcategory.name}</Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{book.title}</h1>
                {author && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{author.name}</span>
                  </div>
                )}
                <p className="text-muted-foreground">{book.description}</p>
                {book.type === 'book' && book.bookPrice != null && (
                  <p className="text-lg font-semibold text-primary">
                    ${book.bookPrice.toFixed(2)} (full book)
                  </p>
                )}
                <div className="pt-4 flex flex-wrap gap-3">
                  {/* <Link href={getHomeRoutePath()}>
                    <Button className="global_btn rounded_full bg_primary">
                      <BookOpen className="h-4 w-4" />
                      View on Website
                    </Button>
                  </Link> */}
                  <Link href={getBooksRoutePath()}>
                    <Button className="global_btn rounded_full outline_primary">
                      Browse All Books
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found: had id but no book
  if (bookId && !book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Link
            href={getBooksRoutePath()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Books
          </Link>
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Book not found.</p>
            <Link href={getBooksRoutePath()}>
              <Button className="global_btn rounded_full outline_primary mt-4">
                Browse all books
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Books listing (no id)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Books</h1>
          <p className="text-muted-foreground">
            Explore our collection of books
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((b) => {
            const author = authors.find((a) => a.id === b.authorId);
            const category = categories.find((c) => c.id === b.categoryId);
            return (
              <Card
                key={b.id}
                className="overflow-hidden rounded-3xl shadow-sm hover:shadow-lg transition-all flex flex-col h-full"
              >
                <Link href={getBooksRoutePath({ id: b.id })} className="flex flex-1 flex-col">
                  <div className="aspect-3/4 overflow-hidden bg-muted relative group">
                    <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                      <ImageComponent
                        src={b.coverImage}
                        alt={b.title}
                        object_cover={true}
                      />
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <h3 className="font-bold line-clamp-1">{b.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      by {author?.name ?? 'Unknown'}
                    </p>
                    {category && (
                      <Badge variant="outline" className="text-xs w-fit mt-1">
                        {category.name}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="pb-3 flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {b.description}
                    </p>
                  </CardContent>
                </Link>
                <CardFooter className="pt-0">
                  <Link href={getBooksRoutePath({ id: b.id })} className="w-full">
                    <Button className="global_btn rounded_full outline_primary w-full">
                      View details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {books.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No books available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
