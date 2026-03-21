
import { AdminSettingsHeader } from './AdminSettingsHeader';
import { GeneralSettingsCard } from './GeneralSettingsCard';

export function AdminSettingsTab() {
  return (
    <>
      <div className="space-y-8">
        <AdminSettingsHeader />
        <GeneralSettingsCard />
      </div>
    </>
  );
}
