import { ArrowUpRight, Users } from 'lucide-react';
import Button from '../../ui/Button';
import { Card } from '../../ui/card';

export interface ActivityItem {
  id: number;
  user: string;
  action: string;
  item: string;
  time: string;
}

interface DashboardRecentActivityProps {
  items: ActivityItem[];
}

export function DashboardRecentActivity({ items }: DashboardRecentActivityProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <Button className="global_btn rounded_full outline_primary">
          View All
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        {items.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
            <div className="p-2 bg-primary/10 rounded-full mt-1">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>
                {' '}
                <span className="text-muted-foreground">{activity.action}</span>
                {activity.item && (
                  <>
                    {' '}
                    <span className="font-medium">{activity.item}</span>
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
