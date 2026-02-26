import { Badge } from '../../ui/badge';

interface AdminReviewsHeaderProps {
  totalCount: number;
}

export function AdminReviewsHeader({ totalCount }: AdminReviewsHeaderProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Reviews & Ratings
          </h1>
          <p className="text-muted-foreground">
            Monitor and moderate user reviews
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Total Reviews: {totalCount}
        </Badge>
      </div>
    </div>
  );
}
