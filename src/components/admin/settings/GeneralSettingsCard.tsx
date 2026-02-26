import { Settings } from 'lucide-react';
import { Card } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';

export function GeneralSettingsCard() {
  return (
    <Card className="p-6 rounded-3xl">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-xl">
          <Settings className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">General Settings</h3>
          <p className="text-sm text-muted-foreground">
            Basic platform configuration
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Platform Name</Label>
          <Input defaultValue="Taaluma.world" className="mt-2" />
        </div>
        <div>
          <Label>Platform Description</Label>
          <Textarea
            defaultValue="Professional learning platform for college graduates and young professionals"
            className="mt-2"
            rows={3}
          />
        </div>
        <div>
          <Label>Support Email</Label>
          <Input type="email" defaultValue="support@taaluma.world" className="mt-2" />
        </div>
      </div>
    </Card>
  );
}
