import { AlertCircle } from 'lucide-react';
import { Card } from '../../ui/card';

interface ModerationPendingBannerProps {
  count: number;
}

export function ModerationPendingBanner({ count }: ModerationPendingBannerProps) {
  return (
    <Card className="p-6 bg-orange-50 border-orange-200 rounded-3xl">
      <div className="flex items-start gap-4">
        <AlertCircle className="h-6 w-6 text-orange-600 shrink-0" />
        <div>
          <h3 className="font-semibold mb-1">Pending Items</h3>
          <p className="text-sm text-muted-foreground">
            You have {count} item(s) that require moderation.
          </p>
        </div>
      </div>
    </Card>
  );
}
