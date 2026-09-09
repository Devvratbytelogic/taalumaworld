'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import BlueprintPublicDetails from '@/components/blueprint/BlueprintPublicDetails';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';
import { useGetPurchasedBlueprintQuery } from '@/store/rtkQueries/userGetAPI';
import { getUserDashboardMyChaptersRoutePath } from '@/routes/routes';
import { DashboardBlueprintReaderSkeleton } from '@/components/skeleton-loader/userDashboardSkeletons';

export default function MyBlueprintReader({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: response, isLoading, isError } = useGetPurchasedBlueprintQuery(slug, { skip: !slug });
  const data = response?.data;

  if (isLoading) {
    return <DashboardBlueprintReaderSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <Link
          href={getUserDashboardMyChaptersRoutePath()}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Blueprints
        </Link>
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
          Blueprint not found in your library.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader
        title={data.title}
        description={
          data.seriesTitle || data.bookTitle
            ? `From ${data.seriesTitle || data.bookTitle}`
            : `Blueprint ${data.blueprintNumber || data.chapterNumber}`
        }
      >
        <Button
          type="button"
          className="global_btn rounded_full outline_primary"
          onPress={() => router.push(getUserDashboardMyChaptersRoutePath())}
          startContent={<ArrowLeft className="h-4 w-4" />}
        >
          Back to My Blueprints
        </Button>
      </UserDashboardPageHeader>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
        <BlueprintPublicDetails data={data} hideMentorDetails />
      </div>
    </div>
  );
}
