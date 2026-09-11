'use client';

import { useEffect, useState } from 'react';
import BlueprintPublicHero from '@/components/blueprint/BlueprintPublicHero';
import BlueprintPublicDetails from '@/components/blueprint/BlueprintPublicDetails';
import BlueprintReviews from '@/components/blueprint/BlueprintReviews';
import LoginRequiredGate from '@/components/auth/LoginRequiredGate';
import ChapterPurchaseGate from '@/components/pages-components/chapter/ChapterPurchaseGate';
import DirectPurchasePaymentModal from '@/components/payments/DirectPurchasePaymentModal';
import { useGetSingleChapterQuery } from '@/store/rtkQueries/userGetAPI';
import { useAuth } from '@/hooks/useAuth';
import { getDirectPurchasePaystackReference } from '@/utils/paystackReturn';
import type { ISingleChapterAPIResponseData } from '@/types/user/singleChapter';

interface BlueprintPageClientProps {
  slug: string;
  initialData: ISingleChapterAPIResponseData | null;
}

export default function BlueprintPageClient({ slug, initialData }: BlueprintPageClientProps) {
  const { isAuthenticated } = useAuth();
  const [paystackReference, setPaystackReference] = useState<string | null>(null);
  const [searchChecked, setSearchChecked] = useState(false);

  useEffect(() => {
    setPaystackReference(getDirectPurchasePaystackReference(new URLSearchParams(window.location.search)));
    setSearchChecked(true);
  }, []);

  const { data: liveRes, isSuccess, isError } = useGetSingleChapterQuery(slug, {
    skip: !isAuthenticated,
  });

  const data = isAuthenticated ? liveRes?.data ?? initialData : initialData;
  const skipGates = !searchChecked || Boolean(paystackReference);
  const accessPending = !searchChecked || (isAuthenticated && !isSuccess && !isError);
  const skipLoginGate = skipGates || isAuthenticated;
  const skipPurchaseGate = skipGates || !isSuccess;

  return (
    <>
      <LoginRequiredGate
        isAuthenticated={isAuthenticated}
        action="view"
        itemType="chapter"
        skip={skipLoginGate}
      />
      <ChapterPurchaseGate
        isAuthenticated={isAuthenticated}
        chapter={isAuthenticated && isSuccess ? liveRes?.data ?? null : null}
        skip={skipPurchaseGate}
      />
      {paystackReference ? (
        <DirectPurchasePaymentModal
          reference={paystackReference}
          kind="blueprint"
          slug={slug}
        />
      ) : null}

      <div className="space-y-10 space_top">
        <BlueprintPublicHero data={data} accessPending={accessPending} liveReady={Boolean(isAuthenticated && isSuccess)} />
        <BlueprintPublicDetails data={data} accessPending={accessPending} />
        <BlueprintReviews
          itemId={data?.id}
          itemTitle={data?.title}
          isPurchased={!accessPending && Boolean(data?.isPurchased)}
          isReviewed={Boolean(data?.isReviewed)}
        />
      </div>
    </>
  );
}
