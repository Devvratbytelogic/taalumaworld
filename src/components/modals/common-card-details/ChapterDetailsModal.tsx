'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { BookOpen, FileText, Lock, ShoppingCart, User } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/react';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button';
import AddToCartButton from '@/components/ui/AddToCartButton';
import ImageComponent from '@/components/ui/ImageComponent';
import BlueprintShareButtons from '@/components/blueprint/BlueprintShareButtons';
import { useAuth } from '@/hooks/useAuth';
import { getCartRoutePath, getReadChapterRoutePath } from '@/routes/routes';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';

const modalClassNames = {
  base: 'max-w-xl rounded-3xl overflow-hidden',
  wrapper: 'px-6 py-12',
  body: 'p-0',
  footer: 'p-0',
  closeButton: 'z-10 bg-white/90 backdrop-blur-sm rounded-full! right-2 top-2',
};

export default function ChapterDetailsModal() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const { isAuthenticated } = useAuth();
  const chapter = data?.chapter

  const onClose = () => dispatch(closeModal());
  const bookData = chapter?.bookId;
  const isBookPricing = bookData?.pricingModel === 'book';
  const bookPrice = bookData?.price ?? 0;
  const bookDbId = bookData?._id ?? '';

  const openLogin = (action: string, itemType: string) => {
    dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action, itemType } }));
  };

  const goToCart = () => {
    dispatch(closeModal());
    router.push(getCartRoutePath());
  };

  const readChapter = () => {
    if (!isAuthenticated) {
      openLogin('read', 'chapter');
      return;
    }
    dispatch(closeModal());
    router.push(getReadChapterRoutePath(chapter.id));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="modal_container" size="xl" classNames={modalClassNames}>
      <ModalContent>
        {chapter?.coverImage && (
          <div className="relative shrink-0 bg-muted flex justify-center py-6">
            <div className="w-40 aspect-3/4 rounded-2xl overflow-hidden shadow-lg">
              <ImageComponent src={chapter?.coverImage} alt={chapter?.title} object_cover={false} />
            </div>
          </div>
        )}

        <ModalBody className="p-6! space-y-4 overflow-y-auto max-h-[30vh] sm:max-h-[40vh] custom_scrollbar min-w-0">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1 text-sm font-medium">
                Blueprint {chapter?.chapterNumber}
              </Badge>
              {chapter?.isFree && (
                <Badge className="bg-success/10 text-success border-success/20 rounded-full px-3 py-1 text-sm font-medium">
                  Free
                </Badge>
              )}
              {chapter?.bookTitle && (
                <Badge variant="outline" className="rounded-full px-3 py-1 text-sm font-medium max-w-50">
                  <BookOpen className="h-3 w-3 mr-1.5 shrink-0" />
                  <span className="truncate">{chapter?.bookTitle}</span>
                </Badge>
              )}
            </div>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight wrap-break-word">{chapter?.title}</h2>
            {chapter?.author && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm tracking-tight min-w-0">
                <User className="h-4 w-4 shrink-0" />
                <span className="truncate">{chapter?.author}</span>
              </div>
            )}
          </div>

          {chapter?.description && (
            <div className="min-w-0">
              <h3 className="font-semibold text-sm mb-1.5 tracking-tight">About this Blueprint</h3>
              <p className="text-sm text-muted-foreground leading-relaxed tracking-tight wrap-break-word">
                {chapter?.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 p-3 bg-accent/30 rounded-2xl">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground tracking-tight">Pages</div>
                <div className="font-semibold text-sm tracking-tight">{chapter?.pageCount ?? 0}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold text-primary mt-0.5 shrink-0">KSh</span>
              <div>
                <div className="text-sm text-muted-foreground tracking-tight">Price</div>
                <div className="font-semibold text-sm tracking-tight">
                  {chapter?.isFree
                    ? 'Free'
                    : isBookPricing
                      ? `KSH ${bookPrice?.toFixed(2) ?? '0.00'} (series)`
                      : `KSH ${chapter?.price?.toFixed(2) ?? '0.00'}`}
                </div>
              </div>
            </div>
            {chapter?.bookTitle && (
              <div className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground tracking-tight">Part of</div>
                  <div className="font-semibold text-sm line-clamp-1 tracking-tight">{chapter?.bookTitle}</div>
                </div>
              </div>
            )}
          </div>

          {isBookPricing && !chapter?.canRead && (
            <div className="flex items-center gap-3 p-3 bg-accent/40 rounded-2xl border border-border">
              <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                This chapter is only available as part of the complete series purchase.
              </p>
            </div>
          )}

          {bookData && (
            <div className="border-t pt-3">
              <h3 className="font-semibold text-sm mb-2 tracking-tight">About the Series</h3>
              <div className="flex gap-3">
                {bookData?.coverImage && (
                  <div className="w-16 h-20 rounded-2xl shrink-0 overflow-hidden">
                    <ImageComponent src={bookData?.coverImage} alt={bookData?.title} object_cover={true} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1 tracking-tight">{bookData?.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed tracking-tight">
                    {bookData?.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-3">
            <h3 className="font-semibold text-sm mb-2 tracking-tight">Share this Blueprint</h3>
            <BlueprintShareButtons
              shareableLink={chapter?.shareable_link ?? ''}
              title={chapter?.title}
              description={chapter?.description}
              size="sm"
              showCopyLink={true}
            />
          </div>
        </ModalBody>

        <ModalFooter className="flex gap-3 p-4 border-t bg-white shrink-0">
          {chapter?.isFree || chapter?.canRead ? (
            <Button className="global_btn rounded_full bg_primary w-full" onPress={readChapter} startContent={<BookOpen className="h-4 w-4" />}>
              {chapter?.isFree ? 'Read Free Blueprint' : 'Read Blueprint'}
            </Button>
          ) : isBookPricing ? (
            !isAuthenticated ? (
              <Button
                className="global_btn rounded_full bg_primary w-full"
                onPress={() => openLogin('cart', 'chapter')}
                startContent={<ShoppingCart className="h-4 w-4" />}
              >
                Buy Complete Series - KSH {bookPrice.toFixed(2)}
              </Button>
            ) : chapter.isCart ? (
              <Button className="global_btn rounded_full bg_primary w-full" onPress={goToCart} startContent={<ShoppingCart className="h-4 w-4" />}>
                Go to Cart
              </Button>
            ) : (
              <AddToCartButton
                chapterId={bookDbId}
                bookId={bookDbId}
                type="book"
                price={bookPrice}
                className="global_btn rounded_full bg_primary w-full"
                label={`Buy Complete Series - KSH ${bookPrice.toFixed(2)}`}
                onSuccess={goToCart}
              />
            )
          ) : !isAuthenticated ? (
            <Button
              className="global_btn rounded_full bg_primary w-full"
              onPress={() => openLogin('cart', 'chapter')}
              startContent={<ShoppingCart className="h-4 w-4" />}
            >
              Add to Cart - KSH {chapter?.price?.toFixed(2) ?? '0.00'}
            </Button>
          ) : chapter?.isCart ? (
            <Button className="global_btn rounded_full bg_primary w-full" onPress={goToCart} startContent={<ShoppingCart className="h-4 w-4" />}>
              Go to Cart
            </Button>
          ) : (
            <AddToCartButton
              chapterId={chapter?.id}
              bookId={bookDbId}
              type={chapter?.type}
              price={chapter?.price}
              className="global_btn rounded_full bg_primary w-full"
              label={`Add to Cart - KSH ${chapter?.price?.toFixed(2) ?? '0.00'}`}
              onSuccess={goToCart}
            />
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
