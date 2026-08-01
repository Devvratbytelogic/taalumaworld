'use client';

import { useEffect, useState } from 'react';
import moment from 'moment';
import { Save, Star, X } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Button from '@/components/ui/Button';
import { adminSelectClass } from '@/components/admin/layout/AdminContent';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useUpdateAdminReviewStatusMutation } from '@/store/rtkQueries/adminReviewsApi';
import toast from '@/utils/toast';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';

const REVIEWS_MODEL = 'Reviews';

type ReviewStatusUpdate = 'Approved' | 'Rejected';

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200!',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  rejected: 'bg-red-50 text-red-700 border-red-200!',
};

const STATUS_OPTIONS: { value: ReviewStatusUpdate; label: string }[] = [
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
];

function formatStatusLabel(status?: string) {
  if (!status) return '—';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatTypeLabel(type?: string) {
  if (type === 'Chapter') return 'Blueprint';
  if (type === 'Book') return 'Series';
  return type || '—';
}

function toStatusUpdate(status?: string): ReviewStatusUpdate {
  return status?.toLowerCase() === 'rejected' ? 'Rejected' : 'Approved';
}

export function ReviewStatusModal() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission(REVIEWS_MODEL, 'edit');

  const [status, setStatus] = useState<ReviewStatusUpdate>('Approved');
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [updateAdminReviewStatus, { isLoading: isUpdating }] = useUpdateAdminReviewStatusMutation();

  const isRejectWithoutReason = status === 'Rejected' && !reason.trim();

  useEffect(() => {
    if (!isOpen) return;
    setStatus(toStatusUpdate(data?.status));
    setReason(data?.reason ?? '');
    setReasonError('');
  }, [isOpen, data]);

  const onClose = () => {
    setReason('');
    setReasonError('');
    dispatch(closeModal());
  };

  const handleSubmit = async () => {
    if (!data?.id) return;

    if (status === 'Rejected' && !reason.trim()) {
      setReasonError('Rejection reason is required.');
      toast.error('Please provide a rejection reason.');
      return;
    }

    try {
      const res = await updateAdminReviewStatus({
        id: data.id,
        values: {
          status,
          ...(status === 'Rejected' ? { reason: reason.trim() } : {}),
        },
      }).unwrap();

      if (res?.http_status_code === 200 || res?.http_status_code === 201 || res?.success) {
        toast.success(res?.message ?? 'Review status updated successfully');
        onClose();
      }
    } catch (error) {
      console.error('Failed to update review status', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="modal_container" size="xl" scrollBehavior="inside">
      <ModalContent className="admin_panel">
        <ModalHeader className="flex flex-col gap-1">
          <p className="text-xl font-bold">Review details</p>
          <p className="text-sm font-normal text-muted-foreground">
            View the review and update its moderation status.
          </p>
        </ModalHeader>

        {data ? (
          <>
            <ModalBody className="gap-4 text-sm">
              <div className="flex items-center gap-3">
                <Avatar className="border h-11 w-11 shrink-0">
                  <AvatarImage
                    src={data?.customer?.profile_pic ?? ''}
                    alt={data?.customer?.name ?? 'Customer'}
                  />
                  <AvatarFallback>
                    {data?.customer?.name?.substring(0, 2).toUpperCase() || '—'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">{data?.customer?.name || '—'}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {data?.customer?.email || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Current status:</span>
                <Badge
                  variant="outline"
                  className={
                    STATUS_BADGE_CLASS[String(data?.status || 'pending').toLowerCase()] ??
                    STATUS_BADGE_CLASS.pending
                  }
                >
                  {formatStatusLabel(data?.status)}
                </Badge>
              </div>

              <div className="grid gap-2 rounded-md border border-slate-100 bg-slate-50/60 p-3 sm:grid-cols-2">
                <p className="sm:col-span-2">
                  <span className="text-slate-500">Item:</span>{' '}
                  <span className="font-medium text-slate-900">{data?.item?.title || '—'}</span>
                </p>
                <p>
                  <span className="text-slate-500">Type:</span> {formatTypeLabel(data?.type)}
                </p>
                <p>
                  <span className="text-slate-500">Series:</span> {data?.item?.series?.title || '—'}
                </p>
                <p>
                  <span className="text-slate-500">Date:</span>{' '}
                  {data?.createdAt ? moment(data?.createdAt).format('DD/MM/YYYY HH:mm') : '—'}
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-slate-500">Rating:</span>
                  <span className="inline-flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className={`h-3.5 w-3.5 ${value <= (data?.rating ?? 0)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                          }`}
                      />
                    ))}
                  </span>
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="text-slate-500">Comment</p>
                <p className="rounded-md border border-slate-100 bg-white p-3 text-slate-700 whitespace-pre-wrap">
                  {data?.comment?.trim() || '—'}
                </p>
              </div>

              {canEdit ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="review-status">Status</Label>
                    <select
                      id="review-status"
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value as ReviewStatusUpdate);
                        setReasonError('');
                      }}
                      className={`${adminSelectClass} w-full`}
                      disabled={isUpdating}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {status === 'Rejected' ? (
                    <div className="space-y-2">
                      <Label htmlFor="review-rejection-reason">
                        Rejection reason <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="review-rejection-reason"
                        rows={3}
                        value={reason}
                        onChange={(e) => {
                          setReason(e.target.value);
                          if (reasonError) setReasonError('');
                        }}
                        placeholder="Explain why this review is being rejected..."
                        disabled={isUpdating}
                        aria-invalid={!!reasonError}
                      />
                      {reasonError ? (
                        <p className="text-sm text-red-600">{reasonError}</p>
                      ) : null}
                    </div>
                  ) : null}
                </>
              ) : data?.reason ? (
                <div className="space-y-1.5">
                  <p className="text-slate-500">Rejection reason</p>
                  <p className="rounded-md border border-slate-100 bg-white p-3 text-slate-700 whitespace-pre-wrap">
                    {data.reason}
                  </p>
                </div>
              ) : null}
            </ModalBody>

            <ModalFooter>
              <Button
                type="button"
                className="global_btn outline_primary rounded_full"
                onPress={onClose}
                isDisabled={isUpdating}
              >
                <X className="h-4 w-4" /> {canEdit ? 'Cancel' : 'Close'}
              </Button>
              {canEdit ? (
                <Button
                  type="button"
                  className="global_btn bg_primary rounded_full"
                  onPress={handleSubmit}
                  isLoading={isUpdating}
                  isDisabled={isUpdating || isRejectWithoutReason}
                >
                  <Save className="h-4 w-4" /> Update status
                </Button>
              ) : null}
            </ModalFooter>
          </>
        ) : (
          <ModalBody className="py-12 text-center text-sm text-muted-foreground">
            Review not found.
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
