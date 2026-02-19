/**
 * Admin Settings Tab
 * Platform configuration and settings
 */

import { Card } from '../ui/card';
import Button from '../ui/Button';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Settings, Save, Globe, Mail, Bell, Shield } from 'lucide-react';
import type { ContentMode } from '../../types/admin';
import { cn } from '../ui/utils';

interface AdminSettingsTabProps {
  contentMode: ContentMode;
  onContentModeChange: (checked: boolean) => void;
}

export function AdminSettingsTab({ contentMode, onContentModeChange }: AdminSettingsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Platform Settings</h2>
        <p className="text-muted-foreground">Configure your platform settings</p>
      </div>

      {/* Content Mode Settings */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Content Mode</h3>
            <p className="text-sm text-muted-foreground">
              Control whether the platform operates in Chapter-focused or Book-focused mode
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium">Current Mode</p>
              <p className="text-sm text-muted-foreground">
                Platform is currently in {contentMode === 'chapters' ? 'Chapter' : 'Book'} Mode
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn(
                "text-sm font-medium transition-all duration-200",
                contentMode === 'chapters' ? 'text-primary' : 'text-muted-foreground'
              )}>
                Chapters
              </span>
              <Switch
                checked={contentMode === 'books'}
                onCheckedChange={onContentModeChange}
              />
              <span className={cn(
                "text-sm font-medium transition-all duration-200",
                contentMode === 'books' ? 'text-primary' : 'text-muted-foreground'
              )}>
                Books
              </span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Changing the content mode will affect how content is displayed
              across the entire platform. Users will see {contentMode === 'chapters' ? 'individual chapters' : 'complete books'}
              as the primary content type.
            </p>
          </div>
        </div>
      </Card>

      {/* General Settings */}
      <Card className="p-6">
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

      {/* Notification Settings */}
      <Card className="p-6">
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
          {[
            { label: 'Email notifications for new users', description: 'Get notified when users register' },
            { label: 'Email notifications for purchases', description: 'Get notified when content is purchased' },
            { label: 'Daily summary reports', description: 'Receive daily platform statistics' },
            { label: 'Alert for flagged content', description: 'Immediate alerts for moderation queue' },
          ].map((item, index) => (
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

      {/* Security Settings */}
      <Card className="p-6">
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

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-2" size="lg">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
