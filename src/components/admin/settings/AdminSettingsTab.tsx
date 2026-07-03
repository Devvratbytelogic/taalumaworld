
import { AdminSettingsHeader } from './AdminSettingsHeader';
import { GeneralSettingsCard } from './GeneralSettingsCard';

export function AdminSettingsTab() {
  return (
    <>
      <div className="space-y-6">
        <AdminSettingsHeader />
        <GeneralSettingsCard />
      </div>
    </>
  );
}
