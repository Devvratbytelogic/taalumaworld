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

interface DeleteChapterDialogProps {
  chapter: Chapter | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteChapterDialog({
  chapter,
  open,
  onOpenChange,
  onConfirm,
}: DeleteChapterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Chapter</DialogTitle>
          <DialogDescription>
            {chapter
              ? `Are you sure you want to delete "${chapter.title}"? This cannot be undone.`
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
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
