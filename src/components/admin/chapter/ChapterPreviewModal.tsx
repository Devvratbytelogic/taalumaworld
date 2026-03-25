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
import ImageComponent from '@/components/ui/ImageComponent';
import { IAllChaptersAPIResponseData } from '@/types/chapter';

interface ChapterPreviewModalProps {
  chapter: IAllChaptersAPIResponseData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChapterPreviewModal({
  chapter,
  open,
  onOpenChange,
}: ChapterPreviewModalProps) {
  if (!chapter) return null;


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
            {chapter?.coverImage ? (
              <div className="rounded-2xl overflow-hidden bg-muted border border-border aspect-4/4 w-32 shrink-0">
                <ImageComponent
                  src={chapter?.coverImage ?? undefined}
                  alt={chapter.title}
                  object_cover={true}
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
                Chapter {chapter.number}
                {chapter?.book?.title && ` · ${chapter?.book?.title}`}
              </p>
              {chapter?.book?.thoughtLeader?.fullName && (
                <p className="text-sm text-muted-foreground">Thought Leader: {chapter?.book?.thoughtLeader?.fullName}</p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <span className="font-semibold text-primary">
                  {chapter.isFree ? 'Free' : `KSH ${chapter.price.toFixed(2)}`}
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
              <dd className="font-medium">{chapter?.book?.title ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Thought Leader</dt>
              <dd className="font-medium">{chapter?.book?.thoughtLeader?.fullName ?? 'Unknown'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Chapter Number</dt>
              <dd className="font-medium">{chapter.number}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Price</dt>
              <dd className="font-medium">
                {chapter.isFree ? 'Free' : `KSH ${chapter.price.toFixed(2)}`}
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
          {/* {onOpenFullPage && (
            <Button
              type="button"
              className="global_btn rounded_full bg_primary"
              onPress={() => onOpenFullPage(chapter)}
              startContent={<ExternalLink className="h-4 w-4" />}
            >
              Open full page
            </Button>
          )} */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
