import SeriesPublicHero from '@/components/series/SeriesPublicHero';
import SeriesPublicDetails from '@/components/series/SeriesPublicDetails';
import { getSingleSeriesServerAPI } from '@/store/server-api/serverSideAPIs';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SingleSeriesPage({ params }: PageProps) {
  const { slug } = await params;
  const response = await getSingleSeriesServerAPI({ slug });
  const data = response?.data ?? null;

  return (
    <div className="space-y-10 space_top">
      <SeriesPublicHero data={data} slug={slug} />
      <SeriesPublicDetails data={data} />
    </div>
  );
}
