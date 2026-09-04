'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useCreateReviewMutation } from '@/store/rtkQueries/userPostAPI';
import toast from '@/utils/toast';

export function AddReviewModal() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const itemId = data?.itemId ?? '';
  const itemTitle = data?.itemTitle ?? '';
  const type = data?.type ?? 'Chapter';

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setComment('');
  };

  const onClose = () => {
    resetForm();
    dispatch(closeModal());
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!itemId) return;
    if (rating < 1) {
      toast.error('Please select a rating');
      return;
    }

    try {
      const res = await createReview({
        type,
        itemId,
        rating,
        ...(comment.trim() ? { comment: comment.trim() } : {}),
      }).unwrap();

      if (res?.http_status_code === 200 || res?.http_status_code === 201 || res?.success) {
        toast.success(res?.message ?? 'Review submitted successfully');
        data?.onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Failed to submit review', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="outside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Add review</h2>
          <p className="text-sm font-normal text-muted-foreground">
            {itemTitle
              ? `Share your thoughts on “${itemTitle}”.`
              : 'Share your thoughts on this blueprint.'}
          </p>
        </ModalHeader>

        <ModalBody className="gap-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => {
                const active = value <= (hoveredRating || rating);
                return (
                  <button
                    key={value}
                    type="button"
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(value)}
                    className="rounded-md p-1 transition-colors hover:bg-primary/5"
                    aria-label={`Rate ${value} star${value === 1 ? '' : 's'}`}
                  >
                    <Star
                      className={`${active ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} h-6 w-6 transition-colors`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-comment">Comment (optional)</Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or learn?"
              rows={4}
              disabled={isLoading}
            />
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
            isDisabled={isLoading || rating < 1}
            onPress={handleSubmit}
          >
            {isLoading ? 'Submitting…' : 'Submit review'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
