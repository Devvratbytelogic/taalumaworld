import Button from '../../ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import type { BooksEntity } from '@/types/books';

interface DeleteBookDialogProps {
  book: BooksEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteBookDialog({
  book,
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: DeleteBookDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Book</DialogTitle>
          <DialogDescription>
            {book
              ? `Are you sure you want to delete "${book.title}"? This cannot be undone.`
              : ''}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onPress={() => onOpenChange(false)}
            className="global_btn rounded_full outline_primary"
            isDisabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onPress={onConfirm}
            className="global_btn rounded_full bg-destructive text-destructive-foreground"
            isLoading={isDeleting}
            isDisabled={isDeleting}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
