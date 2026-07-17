import type { Metadata } from 'next';
import SeriesPublicHero from '@/components/series/SeriesPublicHero';
import SeriesPublicDetails from '@/components/series/SeriesPublicDetails';
import { getSingleSeriesServerAPI } from '@/store/server-api/serverSideAPIs';

type PageProps = {
  params: Promise<{ slug: string }>;
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

  return {
    title,
    description,
    openGraph: {
      title: bookDetails?.og_title || title,
      description: bookDetails?.og_description || description,
      ...(bookDetails?.og_image || bookDetails?.coverImage
        ? { images: [{ url: bookDetails?.og_image || bookDetails?.coverImage }] }
        : {}),
    },
  };
}

export default async function SingleSeriesPage({ params }: PageProps) {
  const { slug } = await params;
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

      <div className="space-y-10 space_top">
        <SeriesPublicHero data={data} slug={slug} />
        <SeriesPublicDetails data={data} />
      </div>
    </>
  );
}
