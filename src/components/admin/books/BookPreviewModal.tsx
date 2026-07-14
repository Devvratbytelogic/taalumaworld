import { User, Tag as TagIcon, Wallet, CalendarDays } from 'lucide-react';
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
import { IBook } from '@/types/books';
import moment from 'moment';

interface BookPreviewModalProps {
  book: IBook | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_BADGE: Record<string, string> = {
  Published: 'bg-green-50 text-green-700 border-green-200',
  Draft: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};


export function BookPreviewModal({ book, open, onOpenChange }: BookPreviewModalProps) {
  if (!book) return null;

  const tags = (book.tags ?? []).filter(Boolean) as string[];

  const detailItems = [
    { icon: User, label: 'Mentor', value: book.createdBy?.name ?? 'N/A' },
    {
      icon: Wallet,
      label: 'Pricing Model',
      value: book.pricingModel === 'book' ? 'Series' : (book.pricingModel ?? 'N/A'),
    },
    { icon: CalendarDays, label: 'Created', value: moment(book.createdAt).format('DD MMM YYYY') },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Series Preview</DialogTitle>
          <DialogDescription>Read-only view of series details.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 max-h-[70vh] custom_scrollbar overflow-y-auto pr-1">
          {/* Cover + headline */}
          <div className="flex gap-5">
            {book.coverImage ? (
              <div className="rounded-2xl overflow-hidden bg-muted border border-border w-32 aspect-3/4 shrink-0">
                <ImageComponent src={book.coverImage} alt={book.title} object_cover={true} />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-muted-foreground/30 w-32 aspect-3/4 shrink-0 flex items-center justify-center bg-muted/30">
                <span className="text-xs text-muted-foreground px-2 text-center">No cover</span>
              </div>
            )}

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-semibold leading-tight">{book.title}</h3>
                {book.status && (
                  <Badge
                    variant="outline"
                    className={`${STATUS_BADGE[book.status] ?? ''} shrink-0`}
                  >
                    {book.status}
                  </Badge>
                )}
              </div>

              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                {book.createdBy?.name ?? 'Unknown Mentor'}
              </p>

              {book.pricingModel === 'book' && book.price != null ? (
                <p className="text-xl font-bold text-primary pt-1">
                  KSH {Number(book.price).toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground ml-1.5">/ full series</span>
                </p>
              ) : (
                <div className="pt-1">
                  <Badge variant="secondary" className="capitalize">
                    Priced per blueprint
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div className="space-y-1.5 rounded-xl">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </h4>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">{book.description}</p>
            </div>
          )}

          {/* Detail grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {detailItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-md border border-border bg-background p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </div>
                <p className="text-sm font-medium truncate" title={value}>{value}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <TagIcon className="h-3.5 w-3.5" />
                Tags
              </h4>
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
