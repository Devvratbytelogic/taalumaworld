import { ReviewReportDetailView } from '@/components/admin/reviews/ReviewReportDetailView';

type Props = { params: Promise<{ id: string }> };

export default async function MentorReviewReportDetailPage({ params }: Props) {
  const { id } = await params;
  return <ReviewReportDetailView reportId={id} />;
}
