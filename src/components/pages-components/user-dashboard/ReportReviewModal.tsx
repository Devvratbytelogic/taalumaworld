'use client';

import { useEffect, useState } from 'react';
import { Flag } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useReportReviewMutation } from '@/store/rtkQueries/userPostAPI';
import toast from '@/utils/toast';

export function ReportReviewModal() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const reviewId = data?.reviewId ?? '';

  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [reportReview, { isLoading }] = useReportReviewMutation();

  const resetForm = () => {
    setReason('');
    setReasonError('');
  };

  const onClose = () => {
    resetForm();
    dispatch(closeModal());
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!reviewId) return;
    if (!reason.trim()) {
      setReasonError('reason is required');
      toast.error('reason is required');
      return;
    }

    try {
      const res = await reportReview({
        reviewId,
        reason: reason.trim(),
      }).unwrap();

      if (res?.http_status_code === 200 || res?.http_status_code === 201 || res?.success) {
        toast.success('Thanks. We will review this.');
        data?.onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Failed to report review', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="outside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Report review</h2>
          <p className="text-sm font-normal text-muted-foreground">
            Why are you reporting this?
          </p>
        </ModalHeader>

        <ModalBody className="gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-reason">
              Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="report-reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (reasonError) setReasonError('');
              }}
              placeholder="Describe what is wrong with this review"
              rows={4}
              disabled={isLoading}
              aria-invalid={!!reasonError}
            />
            {reasonError ? <p className="text-sm text-red-600">{reasonError}</p> : null}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            className="global_btn rounded_full outline_primary"
            isDisabled={isLoading}
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="global_btn rounded_full bg_primary"
            isDisabled={isLoading || !reason.trim()}
            onPress={handleSubmit}
          >
            <Flag className="h-4 w-4" />
            {isLoading ? 'Reporting…' : 'Report'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
