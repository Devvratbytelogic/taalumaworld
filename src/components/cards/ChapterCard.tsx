import { FileText, User, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import type { Chapter, Book, Author } from '../../data/mockData';
import ImageComponent from '../ui/ImageComponent';
import { Badge } from '@/components/ui/badge';

interface ChapterCardProps {
  chapter: Chapter;
  book?: Book;
  author?: Author;
  onClick: () => void;
}

export function ChapterCard({ chapter, book, author, onClick }: ChapterCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover-lift transition-all hover:border-primary/50 rounded-3xl flex flex-col h-full"
      onClick={onClick}
    >
      {/* Chapter Featured Image with Free Badge Overlay */}
      {chapter.featuredImage && (
        <div className="aspect-2/1 overflow-hidden bg-muted relative shrink-0">
          <div className="transition-transform hover:scale-105 rounded-[-214px]">
            <ImageComponent
              src={chapter.featuredImage}
              alt={chapter.title}
              object_cover={true}
            />
          </div>
          {/* Free Badge on Image */}
          {chapter.isFree && (
            <div className="absolute top-3.5 right-3.5">
              <Badge className="text-success border-success/20 backdrop-blur-sm bg-white/90 rounded-full px-3 py-1 text-xs font-medium">
                Free
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardContent className="px-4 space-y-1.5 flex flex-col flex-1">
        {/* Book Title and Chapter Number Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {book && (
            <Badge variant="outline" className="text-xs font-medium rounded-full px-3 py-1 max-w-37">
              <BookOpen className="h-3 w-3 mr-1.5 shrink-0" />
              <span className="truncate">{book.title}</span>
            </Badge>
          )}
          <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1 text-xs font-medium">
            Chapter {chapter.sequence}
          </Badge>
        </div>

        {/* Chapter Title */}
        <h3 className="font-semibold text-lg line-clamp-2 tracking-tight">
          {chapter.title}
        </h3>

        {/* Description */}
        {chapter.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 tracking-tight h-10">
            {chapter.description}
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

        {/* Footer with Page Count and Price */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground tracking-tight">
            <FileText className="h-4 w-4" />
            <span>{chapter.pageCount || 0} pages</span>
          </div>

          {chapter.isFree ? (
            <span className="font-medium text-success tracking-tight">Free to Read</span>
          ) : chapter.price ? (
            <span className="font-semibold text-lg text-primary">${chapter.price.toFixed(2)}</span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}