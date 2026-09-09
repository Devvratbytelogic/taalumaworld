import type { Metadata } from 'next';
import SeriesPublicHero from '@/components/series/SeriesPublicHero';
import SeriesPublicDetails from '@/components/series/SeriesPublicDetails';
import DirectPurchasePaymentModal from '@/components/payments/DirectPurchasePaymentModal';
import { getSingleSeriesServerAPI } from '@/store/server-api/serverSideAPIs';
import { getDirectPurchasePaystackReference } from '@/utils/paystackReturn';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reference?: string | string[]; trxref?: string | string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const response = await getSingleSeriesServerAPI({ slug });
  const bookDetails = response?.data?.bookDetails;
  if (!bookDetails) {
    return {
      title: 'Series Not Found | TaalumaWorld',
      description: '',
    };
  }

  const title = bookDetails?.meta_title || bookDetails?.title || 'TaalumaWorld';
  const description = bookDetails?.meta_description || bookDetails?.description || '';
  const ogTitle = bookDetails?.og_title || title;
  const ogDescription = bookDetails?.og_description || description;
  const ogImage = bookDetails?.og_image || bookDetails?.coverImage || undefined;
  const twitterTitle = bookDetails?.twitter_title || ogTitle;
  const twitterDescription = bookDetails?.twitter_description || ogDescription;
  const twitterImage = bookDetails?.twitter_image || ogImage;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: twitterImage ? 'summary_large_image' : 'summary',
      title: twitterTitle,
      description: twitterDescription,
      ...(twitterImage ? { images: [twitterImage] } : {}),
    },
  };
}

export default async function SingleSeriesPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const paystackReference = getDirectPurchasePaystackReference(query);
  const response = await getSingleSeriesServerAPI({ slug });
  const data = response?.data ?? null;

  return (
    <>
      {data?.bookDetails?.json_ld && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: data.bookDetails.json_ld }}
        />
      )}

      {paystackReference ? (
        <DirectPurchasePaymentModal
          reference={paystackReference}
          kind="series"
          slug={slug}
        />
      ) : null}

      <div className="space_top">
        <SeriesPublicHero data={data} slug={slug} />
        <SeriesPublicDetails data={data} />
      </div>
    </>
  );
}
