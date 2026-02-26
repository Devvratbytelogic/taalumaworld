import { Bell } from 'lucide-react';
import { Card } from '../../ui/card';
import { Switch } from '../../ui/switch';

const notificationItems = [
  { label: 'Email notifications for new users', description: 'Get notified when users register' },
  { label: 'Email notifications for purchases', description: 'Get notified when content is purchased' },
  { label: 'Daily summary reports', description: 'Receive daily platform statistics' },
  { label: 'Alert for flagged content', description: 'Immediate alerts for moderation queue' },
];

export function NotificationSettingsCard() {
  return (
    <Card className="p-6 rounded-3xl">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-purple-50 rounded-xl">
          <Bell className="h-6 w-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Configure email and system notifications
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {notificationItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
            <div>
              <p className="font-medium">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <Switch defaultChecked={index < 2} />
          </div>
        ))}
      </div>
    </Card>
  );
}
