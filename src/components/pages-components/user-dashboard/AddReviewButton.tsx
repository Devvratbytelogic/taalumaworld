'use client';

import { Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import Button from '@/components/ui/Button';
import { openModal } from '@/store/slices/allModalSlice';

interface AddReviewButtonProps {
  itemId: string;
  itemTitle?: string;
  type?: 'Chapter' | 'Book';
}

export function AddReviewButton({
  itemId,
  itemTitle,
  type = 'Chapter',
}: AddReviewButtonProps) {
  const dispatch = useDispatch();

  return (
    <Button
      type="button"
      className="global_btn rounded_full outline_primary w-fit"
      onPress={() =>
        dispatch(
          openModal({
            componentName: 'AddReviewModal',
            data: { itemId, itemTitle, type },
          }),
        )
      }
    >
      <Star className="h-4 w-4" />
      Add review
    </Button>
  );
}
