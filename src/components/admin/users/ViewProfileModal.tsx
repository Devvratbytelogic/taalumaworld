'use client';

import { Ban, CircleCheck, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { IAllUsersEntity } from '@/types/rolesPermissions';

interface ViewProfileModalProps {
  user: IAllUsersEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuspend?: (user: IAllUsersEntity) => void;
}

export function ViewProfileModal({
  user,
  open,
  onOpenChange,
  onSuspend,
}: ViewProfileModalProps) {
  if (!user) return null;

  const isSuspended = user.status === 'suspended';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
          <DialogTitle>{user.name}</DialogTitle>
          <DialogDescription>Read-only view of the customer&apos;s profile.</DialogDescription>
        </DialogHeader>

        <div className="custom_scrollbar flex-1 space-y-5 overflow-y-auto p-6!">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="border h-20 w-20">
              <AvatarImage src={user.profile_pic ?? ''} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Role</dt>
              <dd className="mt-1">
                <Badge>{user.role?.name ?? '-'}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Status</dt>
              <dd className="mt-1">
                <Badge
                  variant="outline"
                  className={
                    isSuspended
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-green-50 text-green-700 border-green-200'
                  }
                >
                  {user.status || 'active'}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Customer type</dt>
              <dd className="mt-1 text-sm capitalize text-slate-700">{user.user_type ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Phone</dt>
              <dd className="mt-1 text-sm text-slate-700">{user.phone || user.phone_number || '-'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Join date</dt>
              <dd className="mt-1 text-sm text-slate-700">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Verified</dt>
              <dd className="mt-1">
                <Badge
                  variant="outline"
                  className={
                    user.is_verified
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }
                >
                  {user.is_verified ? 'Yes' : 'No'}
                </Badge>
              </dd>
            </div>
          </dl>
        </div>

        <DialogFooter className="shrink-0 border-t border-slate-100 px-6 py-4">
          <Button
            type="button"
            onPress={() => onOpenChange(false)}
            className="global_btn rounded_full outline_primary"
            startContent={<X className="h-4 w-4" />}
          >
            Close
          </Button>
          {onSuspend && (
            <Button
              type="button"
              onPress={() => onSuspend(user)}
              className={`global_btn rounded_full ${isSuspended ? 'success_btn' : 'danger_btn'}`}
              startContent={isSuspended ? <CircleCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
            >
              {isSuspended ? 'Activate Customer' : 'Suspend Customer'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
