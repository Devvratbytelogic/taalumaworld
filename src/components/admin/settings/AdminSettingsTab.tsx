/**
 * Admin Settings Tab
 * Platform configuration and settings
 */

import { Save } from 'lucide-react';
import Button from '../../ui/Button';
import type { ContentMode } from '../../../types/admin';
import { AdminSettingsHeader } from './AdminSettingsHeader';
import { ContentModeSettingsCard } from './ContentModeSettingsCard';
import { GeneralSettingsCard } from './GeneralSettingsCard';
import { NotificationSettingsCard } from './NotificationSettingsCard';
import { SecuritySettingsCard } from './SecuritySettingsCard';

interface AdminSettingsTabProps {
  contentMode: ContentMode;
  onContentModeChange: (checked: boolean) => void;
}

export function AdminSettingsTab({ contentMode, onContentModeChange }: AdminSettingsTabProps) {
  return (
    <div className="space-y-8">
      <AdminSettingsHeader />
      <ContentModeSettingsCard contentMode={contentMode} onContentModeChange={onContentModeChange} />
      <GeneralSettingsCard />
      <NotificationSettingsCard />
      <SecuritySettingsCard />
      <div className="flex justify-end">
        <Button className="gap-2 global_btn rounded_full bg_primary" size="lg">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
