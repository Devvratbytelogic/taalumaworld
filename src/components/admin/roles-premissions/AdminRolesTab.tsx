/**
 * Admin Roles & Permissions Tab
 * Manage admin roles and permissions (RBAC)
 */

import type { AdminUser } from '@/types/admin';
import { AdminRolesHeader } from './AdminRolesHeader';
import { CurrentRoleCard } from './CurrentRoleCard';
import { RolesOverview } from './RolesOverview';
import { PermissionMatrix } from './PermissionMatrix';

interface AdminRolesTabProps {
  adminUser: AdminUser;
}

export function AdminRolesTab({ adminUser }: AdminRolesTabProps) {
  return (
    <div className="space-y-6">
      <AdminRolesHeader />

      <CurrentRoleCard adminUser={adminUser} />

      <RolesOverview adminUser={adminUser} />

      <PermissionMatrix />
    </div>
  );
}
