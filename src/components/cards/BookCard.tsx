import { BookOpen, User, FileText } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import type { Book, Author } from '../../data/mockData';
import { Badge } from '@/components/ui/badge';

interface BookCardProps {
  book: Book;
  author?: Author;
  chaptersCount: number;
  onClick: () => void;
}

export function BookCard({ book, author, chaptersCount, onClick }: BookCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover-lift transition-all hover:border-primary/50 rounded-3xl flex flex-col h-full"
      onClick={onClick}
    >
      {/* Book Cover Image */}
      {book.coverImage && (
        <div className="aspect-2/1 overflow-hidden bg-muted relative shrink-0">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 rounded-[-214px]"
          />
          {/* Pricing Type Badge on Image */}
          <div className="absolute top-3.5 right-3.5">
            <Badge className="text-primary border-primary/20 backdrop-blur-sm bg-white/90 rounded-full px-3 py-1 text-xs font-medium">
              {book.type === 'book' ? 'Full Book' : 'By Chapter'}
            </Badge>
          </div>
        </div>
      )}

      <CardContent className="px-4 space-y-1.5 flex flex-col flex-1">
        {/* Category/Tags Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {book.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs font-medium rounded-full px-3 py-1 max-w-37"
            >
              <span className="truncate">{tag}</span>
            </Badge>
          ))}
        </div>

        {/* Book Title */}
        <h3 className="font-semibold text-lg line-clamp-2 tracking-tight">
          {book.title}
        </h3>

        {/* Description */}
        {book.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 tracking-tight h-10">
            {book.description}
          </p>
        )}

        {/* Author */}
        {author && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground tracking-tight">
            <User className="h-4 w-4" />
            <span>{author.name}</span>
          </div>
        )}

        {/* Spacer to push footer to bottom */}
        <div className="flex-1" />

        {/* Footer with Chapters Count and Price */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground tracking-tight">
            <BookOpen className="h-4 w-4" />
            <span>{chaptersCount} chapters</span>
          </div>

          {book.type === 'book' && book.bookPrice ? (
            <span className="font-semibold text-lg text-primary">${book.bookPrice.toFixed(2)}</span>
          ) : (
            <span className="font-medium text-sm text-muted-foreground tracking-tight">View Chapters</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
