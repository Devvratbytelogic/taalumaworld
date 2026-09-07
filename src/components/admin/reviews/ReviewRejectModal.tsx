'use client';

import { useEffect, useState } from 'react';
import { Ban, X } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Button from '@/components/ui/Button';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useRejectAdminReviewMutation } from '@/store/rtkQueries/adminReviewsApi';
import toast from '@/utils/toast';

export function ReviewRejectModal() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [rejectAdminReview, { isLoading }] = useRejectAdminReviewMutation();

  useEffect(() => {
    if (!isOpen) return;
    setReason('');
    setReasonError('');
  }, [isOpen, data?.id]);

  const onClose = () => {
    setReason('');
    setReasonError('');
    dispatch(closeModal());
  };

  const handleSubmit = async () => {
    if (!data?.id) return;
    if (!reason.trim()) {
      setReasonError('reason is required');
      toast.error('reason is required');
      return;
    }

    try {
      const res = await rejectAdminReview({
        id: data.id,
        reason: reason.trim(),
      }).unwrap();

      if (res?.http_status_code === 200 || res?.http_status_code === 201 || res?.success) {
        toast.success(res?.message ?? 'Review rejected');
        onClose();
      }
    } catch (error) {
      console.error('Failed to reject review', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="modal_container" size="md" scrollBehavior="inside">
      <ModalContent className="admin_panel">
        <ModalHeader className="flex flex-col gap-1">
          <p className="text-xl font-bold">Reject review</p>
          <p className="text-sm font-normal text-muted-foreground">
            This review will be hidden from the public page
          </p>
        </ModalHeader>

        <ModalBody className="gap-4 text-sm">
          {data?.comment ? (
            <p className="rounded-md border border-slate-100 bg-slate-50/60 p-3 text-slate-700 whitespace-pre-wrap">
              {data.comment}
            </p>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="review-reject-reason">
              Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="review-reject-reason"
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (reasonError) setReasonError('');
              }}
              placeholder="Explain why this review is being rejected..."
              disabled={isLoading}
              aria-invalid={!!reasonError}
            />
            {reasonError ? <p className="text-sm text-red-600">{reasonError}</p> : null}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            className="global_btn outline_primary rounded_full"
            onPress={onClose}
            isDisabled={isLoading}
          >
            <X className="h-4 w-4" /> Cancel
          </Button>
          <Button
            type="button"
            className="global_btn bg_primary rounded_full"
            onPress={handleSubmit}
            isLoading={isLoading}
            isDisabled={isLoading || !reason.trim()}
          >
            <Ban className="h-4 w-4" /> Reject
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
