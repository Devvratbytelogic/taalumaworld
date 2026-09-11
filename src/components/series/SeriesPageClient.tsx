'use client';

import { useEffect, useState } from 'react';
import SeriesPublicHero from '@/components/series/SeriesPublicHero';
import SeriesPublicDetails from '@/components/series/SeriesPublicDetails';
import DirectPurchasePaymentModal from '@/components/payments/DirectPurchasePaymentModal';
import { useGetSingleBookQuery } from '@/store/rtkQueries/userGetAPI';
import { useAuth } from '@/hooks/useAuth';
import { getDirectPurchasePaystackReference } from '@/utils/paystackReturn';
import type { ISingleBookAPIResponseData } from '@/types/user/singleBook';

interface SeriesPageClientProps {
  slug: string;
  initialData: ISingleBookAPIResponseData | null;
}

export default function SeriesPageClient({ slug, initialData }: SeriesPageClientProps) {
  const { isAuthenticated } = useAuth();
  const [paystackReference, setPaystackReference] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPaystackReference(getDirectPurchasePaystackReference(new URLSearchParams(window.location.search)));
    setReady(true);
  }, []);

  const { data: liveRes, isSuccess, isError } = useGetSingleBookQuery(slug, {
    skip: !isAuthenticated,
  });

  const data = isAuthenticated ? liveRes?.data ?? initialData : initialData;
  const accessPending = !ready || (isAuthenticated && !isSuccess && !isError);

  return (
    <>
      {paystackReference ? (
        <DirectPurchasePaymentModal
          reference={paystackReference}
          kind="series"
          slug={slug}
        />
      ) : null}

      <div className="space_top">
        <SeriesPublicHero
          data={data}
          slug={slug}
          accessPending={accessPending}
          liveReady={Boolean(isAuthenticated && isSuccess)}
        />
        <SeriesPublicDetails data={data} accessPending={accessPending} />
      </div>
    </>
  );
}
