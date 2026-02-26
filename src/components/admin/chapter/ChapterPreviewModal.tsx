import { ExternalLink } from 'lucide-react';
import Button from '../../ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import type { Chapter } from '../../../data/mockData';
import type { Book } from '../../../data/mockData';
import type { Author } from '../../../data/mockData';

interface ChapterPreviewModalProps {
  chapter: Chapter | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  books: Book[];
  authors: Author[];
  onOpenFullPage?: (chapter: Chapter) => void;
}

export function ChapterPreviewModal({
  chapter,
  open,
  onOpenChange,
  books,
  authors,
  onOpenFullPage,
}: ChapterPreviewModalProps) {
  if (!chapter) return null;

  const book = books.find((b) => b.id === chapter.bookId);
  const author = book ? authors.find((a) => a.id === book.authorId) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chapter Preview</DialogTitle>
          <DialogDescription>
            Read-only view of chapter details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] custom_scrollbar overflow-y-auto">
          <div className="flex gap-4">
            {chapter.featuredImage ? (
              <div className="rounded-2xl overflow-hidden bg-muted border border-border aspect-4/4 w-32 shrink-0">
                <img
                  src={chapter.featuredImage}
                  alt={chapter.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-muted-foreground/30 aspect-4/4 w-32 shrink-0 flex items-center justify-center bg-muted/30">
                <span className="text-xs text-muted-foreground px-2 text-center">No image</span>
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-xl font-semibold text-foreground">{chapter.title}</h3>
              <p className="text-sm text-muted-foreground">
                Chapter {chapter.sequence}
                {book && ` · ${book.title}`}
              </p>
              {author && (
                <p className="text-sm text-muted-foreground">Thought Leader: {author.name}</p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <span className="font-semibold text-primary">
                  {chapter.isFree ? 'Free' : `$${chapter.price.toFixed(2)}`}
                </span>
                {chapter.isFree && (
                  <span className="text-xs text-muted-foreground">(Free chapter)</span>
                )}
              </div>
            </div>
          </div>

          {chapter.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {chapter.description}
              </p>
            </div>
          )}

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Book</dt>
              <dd className="font-medium">{book?.title ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Thought Leader</dt>
              <dd className="font-medium">{author?.name ?? 'Unknown'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Sequence</dt>
              <dd className="font-medium">{chapter.sequence}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Price</dt>
              <dd className="font-medium">
                {chapter.isFree ? 'Free' : `$${chapter.price.toFixed(2)}`}
              </dd>
            </div>
          </dl>
        </div>
        <DialogFooter>
          <Button
            type="button"
            className="global_btn rounded_full outline_primary"
            onPress={() => onOpenChange(false)}
          >
            Close
          </Button>
          {onOpenFullPage && (
            <Button
              type="button"
              className="global_btn rounded_full bg_primary"
              onPress={() => onOpenFullPage(chapter)}
              startContent={<ExternalLink className="h-4 w-4" />}
            >
              Open full page
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
