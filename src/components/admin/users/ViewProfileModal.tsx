import { Mail, Ban } from 'lucide-react';
import Button from '../../ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import type { AdminListUser } from './UserListing';

interface ViewProfileModalProps {
  user: AdminListUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendEmail?: (user: AdminListUser) => void;
  onSuspend?: (user: AdminListUser) => void;
}

export function ViewProfileModal({
  user,
  open,
  onOpenChange,
  onSendEmail,
  onSuspend,
}: ViewProfileModalProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg border bg-muted/30 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Role</span>
              <Badge variant={user.role === 'Premium User' ? 'default' : 'outline'}>
                {user.role}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                {user.status || 'active'}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Join Date</span>
              <span className="font-medium">{user.joinDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Purchases</span>
              <span className="font-medium">{user.purchases}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              onPress={() => onOpenChange(false)}
              className="global_btn rounded_full outline_primary"
            >
              Close
            </Button>
            {onSendEmail && (
              <Button
                onPress={() => onSendEmail(user)}
                className="global_btn rounded_full bg_primary"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            )}
            {onSuspend && (
              <Button
                onPress={() => onSuspend(user)}
                className="global_btn rounded_full bg-destructive text-destructive-foreground"
              >
                <Ban className="h-4 w-4 mr-2" />
                Suspend User
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
