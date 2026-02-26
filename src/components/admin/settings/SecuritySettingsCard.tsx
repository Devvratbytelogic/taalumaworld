import { Shield } from 'lucide-react';
import { Card } from '../../ui/card';
import { Switch } from '../../ui/switch';

export function SecuritySettingsCard() {
  return (
    <Card className="p-6 rounded-3xl">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-red-50 rounded-xl">
          <Shield className="h-6 w-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Security</h3>
          <p className="text-sm text-muted-foreground">
            Security and access control settings
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <p className="font-medium">Two-factor authentication</p>
            <p className="text-sm text-muted-foreground">Require 2FA for admin access</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <p className="font-medium">Session timeout</p>
            <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </Card>
  );
}
