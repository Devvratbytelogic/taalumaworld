import Button from '../../ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import type { AdminListUser } from './UserListing';

interface SuspendUserDialogProps {
  user: AdminListUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function SuspendUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
}: SuspendUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Suspend User</DialogTitle>
          <DialogDescription>
            {user
              ? `Are you sure you want to suspend "${user.name}"? They will not be able to sign in until reinstated.`
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
            Suspend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
