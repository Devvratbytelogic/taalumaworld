'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import AddToCartButton from '@/components/ui/AddToCartButton';
import { PaystackPayButton } from '@/components/payments/PaystackPayButton';
import { ReferralWalletPayButton } from '@/components/payments/ReferralWalletPayButton';
import { AgreementSentenceList, scrollToAgreementSection } from '@/components/ui/AgreementSentenceList';
import ChapterPurchaseAddresses from '@/components/pages-components/chapter/ChapterPurchaseAddresses';
import { closeModal } from '@/store/slices/allModalSlice';
import { rtkQuerieSetup } from '@/store/services/rtkQuerieSetup';
import { RootState } from '@/store/store';
import { VISIBLE } from '@/constants/contentMode';
import { AGREEMENT_TOUCHPOINTS } from '@/constants/agreements';
// import { useBlockedTouchpoints } from '@/hooks/useBlockedTouchpoints';
import { useGetSingleBookQuery, useGetSingleChapterQuery, useGetUserAddressesQuery } from '@/store/rtkQueries/userGetAPI';

const modalClassNames = {
  base: 'max-w-md rounded-2xl',
  wrapper: 'px-4 py-10 sm:px-6',
  closeButton: 'z-10 rounded-full!',
};

export default function ChapterPurchaseModal() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [acceptedAgreementIds, setAcceptedAgreementIds] = useState<string[]>([]);
  const [allRequiredAccepted, setAllRequiredAccepted] = useState(false);
  const [agreementTouched, setAgreementTouched] = useState(false);
  const agreementSectionRef = useRef<HTMLDivElement>(null);
  const [isWalletPaying, setIsWalletPaying] = useState(false);
  const [isPaystackPaying, setIsPaystackPaying] = useState(false);
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const chapter = data?.chapter;
  const isBook = data?.type === 'series';
  const liveSlug = chapter?.slug ?? '';
  const { data: liveBook } = useGetSingleBookQuery(liveSlug, { skip: !isBook || !liveSlug });
  const { data: liveChapter } = useGetSingleChapterQuery(liveSlug, { skip: isBook || !liveSlug });
  const { data: addressData, isLoading } = useGetUserAddressesQuery();
  const isAddressAvailable = Boolean(addressData?.data && addressData.data.length > 0);
  const isPaymentBusy = isWalletPaying || isPaystackPaying;
  // console.log('chapter', chapter);
  // console.log('liveBook', liveBook);
  // console.log('liveChapter', liveChapter);

  useEffect(() => {
    const canRead = isBook ? liveBook?.data?.bookDetails?.canRead : liveChapter?.data?.canRead;
    if (canRead) dispatch(closeModal());
  }, [isBook, liveBook, liveChapter, dispatch]);
  // const { isTouchpointBlocked } = useBlockedTouchpoints();
  // const checkoutBlocked = isTouchpointBlocked(AGREEMENT_TOUCHPOINTS.CHECKOUT);

  const onClose = () => dispatch(closeModal());

  const isPricingModelChapter = isBook
    ? (chapter?.pricingModel === VISIBLE.CHAPTER)
    : (chapter?.series?.pricingModel === VISIBLE.CHAPTER);

  // Tax follows the address country, so read it from the live fetch, not the modal snapshot.
  const taxPrice = (isBook
    ? liveBook?.data?.bookDetails?.tax
    : (isPricingModelChapter
      ? liveChapter?.data?.tax
      : liveChapter?.data?.series?.tax))
    ?? chapter?.tax ?? 0;
  // console.log('taxPrice', taxPrice);
  // console.log('isPricingModelChapter', isPricingModelChapter);
  // console.log('isBook', isBook);

  const displayPrice = isBook
    ? chapter?.effectivePrice // from BlueprintPublicHero.tsx and serieshero both send its data as chapter object
    : (isPricingModelChapter ? chapter?.effectivePrice : chapter?.series?.effectivePrice);

  const purchaseId = isPricingModelChapter ? chapter?.id : chapter?.series?.id;
  const purchaseType = isPricingModelChapter ? VISIBLE.CHAPTER : VISIBLE.BOOK;

  const subtotal = Number(displayPrice ?? 0);
  const taxPercent = subtotal > 0 ? Math.round((taxPrice / subtotal) * 100) : 0;
  const totalPaymentRequired = subtotal + taxPrice;
  const isFreeOrder = totalPaymentRequired <= 0;
  const addressRequired = !isFreeOrder;
  // Without an address the API falls back to the default rate, so the total is not final yet.
  const isTaxEstimated = addressRequired && !isLoading && !isAddressAvailable && taxPrice > 0;

  const agreementError =
    agreementTouched && !allRequiredAccepted
      ? 'You must accept all required agreements before purchasing'
      : undefined;

  const handlePurchaseSuccess = () => {
    dispatch(rtkQuerieSetup.util.invalidateTags(['SingleChapter', 'AllChapters', 'MyChapters']));
    toast.success('Purchase successful! You can now read this book.');
    dispatch(closeModal());
    router.refresh();
  };

  const validatePurchase = () => {
    // if (checkoutBlocked) return false;
    if (addressRequired && !isAddressAvailable) return false;
    if (!allRequiredAccepted) {
      setAgreementTouched(true);
      scrollToAgreementSection(agreementSectionRef.current);
      return false;
    }
    return true;
  };

  const referralWalletPayload = {
    ...(purchaseType === VISIBLE.CHAPTER
      ? { chapter_id: purchaseId }
      : { book_id: purchaseId }),
    type: purchaseType,
    accepted_agreement_ids: acceptedAgreementIds,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isDismissable={false} className="modal_container" size="md" scrollBehavior="outside" classNames={modalClassNames}>
      <ModalContent>
        <ModalHeader className="flex flex-col items-start gap-1 pb-0">
          <p className="text-lg font-semibold text-foreground">Complete purchase</p>
          <p className="text-sm font-normal text-muted-foreground">
            {isPricingModelChapter
              ? 'Purchase this book to unlock full access.'
              : 'Purchase the complete series to unlock this book.'}
          </p>
        </ModalHeader>

        <ModalBody className="gap-4 py-4">
          <ChapterPurchaseAddresses
            addressData={addressData}
            isLoading={isLoading}
            addressRequired={addressRequired}
          />

          <AgreementSentenceList
            touchpoint={AGREEMENT_TOUCHPOINTS.CHECKOUT}
            onAcceptedAgreementIdsChange={setAcceptedAgreementIds}
            onRequiredAcceptedChange={setAllRequiredAccepted}
            error={agreementError}
            touched={agreementTouched}
            onBlur={() => setAgreementTouched(true)}
            disabled={isPaymentBusy}
            className="space-y-3"
            containerRef={agreementSectionRef}
          />
        </ModalBody>

        <ModalFooter className="flex flex-col gap-2 border-t p-4">
          {subtotal > 0 && (
            <div className="space-y-1.5 rounded-md border border-border bg-muted/30 px-3 py-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">KSH {subtotal.toFixed(2)}</span>
              </div>
              {taxPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tax{taxPercent > 0 ? ` (${taxPercent}%)` : ''}
                  </span>
                  <span className="font-medium">KSH {taxPrice.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border/70 pt-1.5 text-sm font-semibold">
                <span>Total</span>
                <span className="text-primary">KSH {totalPaymentRequired.toFixed(2)}</span>
              </div>
              {isTaxEstimated && (
                <p className="text-xs text-muted-foreground">
                  Add a delivery address to confirm the tax for your country.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            {!isFreeOrder && (
              <ReferralWalletPayButton
                totalPaymentRequired={totalPaymentRequired}
                payload={referralWalletPayload}
                isDisabled={!isAddressAvailable || isPaymentBusy || !purchaseId}
                onBeforePay={validatePurchase}
                onSuccess={handlePurchaseSuccess}
                onLoadingChange={setIsWalletPaying}
              />
            )}
            <PaystackPayButton
              chapterID={purchaseId}
              type={purchaseType}
              acceptedAgreementIds={acceptedAgreementIds}
              callbackUrl={typeof window !== 'undefined' ? window.location.href : undefined}
              label={isFreeOrder ? 'Start Reading' : `Buy Now - KSH ${totalPaymentRequired.toFixed(2)}`}
              appearance={isFreeOrder ? 'action' : 'method'}
              isDisabled={(addressRequired && !isAddressAvailable) || isPaymentBusy || !purchaseId}
              onBeforePay={validatePurchase}
              onSuccess={handlePurchaseSuccess}
              onLoadingChange={setIsPaystackPaying}
            />
          </div>

          {!isFreeOrder && (
            <AddToCartButton
              id={purchaseId}
              type={purchaseType}
              className="global_btn rounded_full outline_primary w-full"
              label="Add to Cart Instead"
            />
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
