import Link from 'next/link';
import { MessageSquare, AlertCircle, TrendingUp } from 'lucide-react';
import Button from '../../ui/Button';
import { Card } from '../../ui/card';

interface DashboardQuickActionsProps {
  pendingTestimonials?: number;
  inactiveContent?: number;
  isLoading?: boolean;
}

export function DashboardQuickActions({
  pendingTestimonials = 0,
  inactiveContent = 0,
  isLoading = false,
}: DashboardQuickActionsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-6 border-l-4 border-l-orange-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-full">
              <MessageSquare className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold">Pending Testimonials</p>
              {isLoading ? (
                <div className="w-10 h-7 rounded bg-muted animate-pulse mt-1" />
              ) : (
                <p className="text-2xl font-bold">{pendingTestimonials}</p>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Testimonials waiting for moderation
        </p>
        <Link href="/admin/testimonials">
          <Button className="global_btn rounded_full outline_primary">
            Review Now
          </Button>
        </Link>
      </Card>

      <Card className="p-6 border-l-4 border-l-red-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-full">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold">Inactive Content</p>
              {isLoading ? (
                <div className="w-10 h-7 rounded bg-muted animate-pulse mt-1" />
              ) : (
                <p className="text-2xl font-bold">{inactiveContent}</p>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Chapters/books not yet published
        </p>
        <Link href="/admin/chapters">
          <Button className="global_btn rounded_full outline_primary">
            View Queue
          </Button>
        </Link>
      </Card>

      <Card className="p-6 border-l-4 border-l-green-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold">System Health</p>
              <p className="text-2xl font-bold">98%</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          All systems operational
        </p>
        <Link href="/admin/analytics">
          <Button className="global_btn rounded_full outline_primary">
            View Details
          </Button>
        </Link>
      </Card>
    </div>
  );
}
