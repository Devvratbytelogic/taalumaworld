'use client';

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Button from '@/components/ui/Button';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useProcessAdminReviewReportMutation } from '@/store/rtkQueries/adminReviewReportsApi';
import toast from '@/utils/toast';

type ProcessAction = 'accept' | 'ignore';

export function ReviewReportProcessModal() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const action = (data?.action as ProcessAction) || 'accept';
  const isIgnore = action === 'ignore';

  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [processReport, { isLoading }] = useProcessAdminReviewReportMutation();

  useEffect(() => {
    if (!isOpen) return;
    setReason('');
    setReasonError('');
  }, [isOpen, data?.id, action]);

  const onClose = () => {
    setReason('');
    setReasonError('');
    dispatch(closeModal());
  };

  const handleSubmit = async () => {
    if (!data?.id) return;
    if (isIgnore && !reason.trim()) {
      setReasonError('reason is required when ignoring a report');
      toast.error('reason is required when ignoring a report');
      return;
    }

    try {
      const res = await processReport({
        id: data.id,
        action,
        ...(reason.trim() ? { reason: reason.trim() } : {}),
      }).unwrap();

      if (res?.http_status_code === 200 || res?.http_status_code === 201 || res?.success) {
        toast.success(res?.message ?? (isIgnore ? 'Report ignored' : 'Report accepted'));
        data?.onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Failed to process review report', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="modal_container" size="md" scrollBehavior="inside">
      <ModalContent className="admin_panel">
        <ModalHeader className="flex flex-col gap-1">
          <p className="text-xl font-bold">{isIgnore ? 'Ignore report' : 'Accept — hide review'}</p>
          <p className="text-sm font-normal text-muted-foreground">
            {isIgnore
              ? 'The review will stay live on the public page.'
              : 'This review will be hidden from the public page'}
          </p>
        </ModalHeader>

        <ModalBody className="gap-4 text-sm">
          {data?.reason ? (
            <div className="space-y-1.5">
              <p className="text-slate-500">Report reason</p>
              <p className="rounded-md border border-slate-100 bg-slate-50/60 p-3 text-slate-700 whitespace-pre-wrap">
                {data.reason}
              </p>
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="report-process-reason">
              {isIgnore ? (
                <>
                  Reason <span className="text-red-500">*</span>
                </>
              ) : (
                'Reason (optional)'
              )}
            </Label>
            <Textarea
              id="report-process-reason"
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (reasonError) setReasonError('');
              }}
              placeholder={isIgnore ? 'Not a policy violation' : 'Confirmed abusive'}
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
            isDisabled={isLoading || (isIgnore && !reason.trim())}
          >
            {isIgnore ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            {isIgnore ? 'Ignore' : 'Accept — hide review'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
