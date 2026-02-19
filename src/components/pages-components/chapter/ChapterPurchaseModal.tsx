'use client';

import { X, Lock, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Chapter, Book } from '@/data/mockData';
import { closeModal } from '@/store/slices/allModalSlice';
import { setChapterPurchased } from '@/store/slices/chapterPurchaseSlice';
import { RootState } from '@/store/store';
import { usePurchaseChapterMutation } from '@/store/api/userApi';
import { useGetPurchasedItemsQuery } from '@/store/api/userApi';
import { useCart } from '@/hooks/useCart';
import { getCartRoutePath } from '@/routes/routes';

interface ChapterPurchaseModalData {
  chapter: Chapter;
  book?: Book;
  closeBehavior?: 'goBack' | 'dismiss';
}

export function ChapterPurchaseModal() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const modalData = (data || {}) as ChapterPurchaseModalData;
  const { chapter, book, closeBehavior = 'dismiss' } = modalData;

  const [purchaseChapter] = usePurchaseChapterMutation();
  const { data: purchasedItems = [] } = useGetPurchasedItemsQuery();
  const ownedChapters = purchasedItems.map((p) => p.chapterId).filter((id): id is string => !!id);
  const { addToCart } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = () => {
    if (closeBehavior === 'goBack') {
      router.back();
    }
    dispatch(closeModal());
  };

  const handleQuickPurchase = async () => {
    if (!chapter) return;
    setIsProcessing(true);

    try {
      await purchaseChapter(chapter.id).unwrap();
      toast.success('Chapter purchased successfully!');
      dispatch(setChapterPurchased(chapter.id));
      dispatch(closeModal());
    } catch {
      toast.error('Payment Failed', {
        description: 'Please try again or contact support.',
      });
      setIsProcessing(false);
    }
  };

  const handleAddToCart = () => {
    if (book && chapter) {
      // addToCart(chapter.id, book.id, ownedChapters);
      // handleClose();
      router.push(getCartRoutePath());
    }
  };

  if (!chapter) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="modal_container"
      size="lg"
      classNames={{
        base: 'max-w-lg rounded-3xl overflow-hidden',
        wrapper: 'px-6 py-12',
        body: 'p-0',
      }}
    >
      <ModalContent>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-warning" />
            </div>
            <h2 className="text-xl font-bold">Chapter Locked</h2>
          </div>

        </div>

        <ModalBody className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] custom_scrollbar">
          {/* Chapter Info */}
          <div className="bg-accent/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full">
                Chapter {chapter.sequence}
              </Badge>
            </div>
            <h3 className="font-bold text-lg">{chapter.title}</h3>
            {chapter.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{chapter.description}</p>
            )}
            {book && (
              <p className="text-sm text-muted-foreground">
                From: <span className="font-medium text-foreground">{book.title}</span>
              </p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <p className="text-foreground">You need to purchase this chapter to continue reading.</p>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-foreground">Chapter Price:</span>
                <span className="text-2xl font-bold text-primary">
                  ${chapter.price?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onPress={handleQuickPurchase}
              className="global_btn rounded_full bg_primary w-full"
              disabled={isProcessing}
              startContent={<ShoppingCart className="h-5 w-5" />}
            >
              {isProcessing ? 'Processing Payment...' : 'Purchase & Continue Reading'}
            </Button>
            <Button
              onPress={handleAddToCart}
              className="global_btn rounded_full outline_primary w-full"
              startContent={<ShoppingCart className="h-5 w-5" />}
            >
              Add to Cart for Later
            </Button>
            <Button onPress={handleClose} className="global_btn rounded_full outline_primary w-full" >
              Go Back
            </Button>
          </div>

        </ModalBody>
        <ModalFooter>
          {/* Info Note */}
          <div className="text-xs text-muted-foreground text-center bg-accent/20 rounded-2xl p-3">
            💡 Once purchased, you&apos;ll have unlimited access to this chapter and can read it
            anytime.
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
