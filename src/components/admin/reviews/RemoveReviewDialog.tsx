import Button from '../../ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import type { ReviewEntry } from './ReviewListing';

interface RemoveReviewDialogProps {
  review: ReviewEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function RemoveReviewDialog({
  review,
  open,
  onOpenChange,
  onConfirm,
}: RemoveReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Remove Review</DialogTitle>
          <DialogDescription>
            {review
              ? `Are you sure you want to remove the review by ${review.userName}? This cannot be undone.`
              : ''}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onPress={() => onOpenChange(false)}
            className="global_btn rounded_full outline_primary"
          >
            Cancel
          </Button>
          <Button
            onPress={onConfirm}
            className="global_btn rounded_full bg-destructive text-destructive-foreground"
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
