import { MessageSquare, AlertCircle, TrendingUp } from 'lucide-react';
import Button from '../../ui/Button';
import { Card } from '../../ui/card';

export function DashboardQuickActions() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-6 border-l-4 border-l-orange-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-full">
              <MessageSquare className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold">Pending Reviews</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Reviews waiting for moderation
        </p>
        <Button className="global_btn rounded_full outline_primary">
          Review Now
        </Button>
      </Card>

      <Card className="p-6 border-l-4 border-l-red-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-full">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold">Flagged Content</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Items requiring immediate attention
        </p>
        <Button className="global_btn rounded_full outline_primary">
          View Queue
        </Button>
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
        <Button className="global_btn rounded_full outline_primary">
          View Details
        </Button>
      </Card>
    </div>
  );
}
