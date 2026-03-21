import Button from '../../ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import type { IAllFaqsDataEntity } from '@/types/faqs';

interface DeleteFAQDialogProps {
  faq: IAllFaqsDataEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteFAQDialog({
  faq,
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeleteFAQDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete FAQ</DialogTitle>
          <DialogDescription>
            {faq
              ? `Are you sure you want to delete this FAQ? This cannot be undone.`
              : ''}
          </DialogDescription>
        </DialogHeader>
        {faq && (
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3 line-clamp-2">
            {faq.question}
          </p>
        )}
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
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
