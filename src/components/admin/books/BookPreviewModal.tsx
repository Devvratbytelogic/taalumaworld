import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import ImageComponent from '@/components/ui/ImageComponent';
import Button from '../../ui/Button';
import { IAllBooksAPIResponseDataEntity } from '@/types/books';

interface BookPreviewModalProps {
  book: IAllBooksAPIResponseDataEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookPreviewModal({ book, open, onOpenChange }: BookPreviewModalProps) {
  if (!book) return null;

  const tags = (book.tags ?? []).filter(Boolean) as string[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book Preview</DialogTitle>
          <DialogDescription>Read-only view of book details.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4 max-h-[70vh] custom_scrollbar overflow-y-auto">
          {/* Cover + headline */}
          <div className="flex gap-4">
            {book.coverImage ? (
              <div className="rounded-2xl overflow-hidden bg-muted border border-border w-32 aspect-3/4 shrink-0">
                <ImageComponent src={book.coverImage} alt={book.title} object_cover={true} />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-muted-foreground/30 w-32 aspect-3/4 shrink-0 flex items-center justify-center bg-muted/30">
                <span className="text-xs text-muted-foreground px-2 text-center">No cover</span>
              </div>
            )}

            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-xl font-semibold">{book.title}</h3>
              <p className="text-sm text-muted-foreground">
                by {book.thoughtLeader?.fullName ?? 'Unknown Thought Leader'}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {book.category?.name && book.category.name !== 'N/A' && (
                  <Badge variant="outline">{book.category.name}</Badge>
                )}
                {book.subcategory?.name && book.subcategory.name !== 'N/A' && (
                  <Badge variant="outline">{book.subcategory.name}</Badge>
                )}
              </div>

              {book.pricingModel === 'book' && book.price != null ? (
                <p className="text-lg font-bold text-primary pt-1">
                  KSH {Number(book.price).toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">/ full book</span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground pt-1 capitalize">
                  Pricing: <span className="font-medium text-foreground">{book.pricingModel ?? 'per chapter'}</span>
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{book.description}</p>
            </div>
          )}

          {/* Detail grid */}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Thought Leader</dt>
              <dd className="font-medium">{book.thoughtLeader?.fullName ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pricing Model</dt>
              <dd className="font-medium capitalize">{book.pricingModel ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Category</dt>
              <dd className="font-medium">{book.category?.name ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Subcategory</dt>
              <dd className="font-medium">{book.subcategory?.name ?? '—'}</dd>
            </div>
          </dl>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="global_btn rounded_full outline_primary"
            onPress={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
