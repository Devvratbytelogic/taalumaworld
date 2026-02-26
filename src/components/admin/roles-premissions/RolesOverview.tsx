import { Shield } from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { getRoleName, getRoleDescription } from '@/utils/adminPermissions';
import type { AdminUser, AdminRole } from '@/types/admin';
import { rolePermissions } from '@/types/admin';
import { ROLES } from './rolesConstants';
import { getEnabledPermissions } from './rolesConstants';

interface RolesOverviewProps {
  adminUser: AdminUser;
}

export function RolesOverview({ adminUser }: RolesOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ROLES.map((role: AdminRole) => {
        const permissions = rolePermissions[role];
        const permissionCount = getEnabledPermissions(permissions).length;
        const isCurrent = adminUser.role === role;

        return (
          <Card key={role} className={isCurrent ? 'border-primary border-2' : ''}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${isCurrent ? 'bg-primary' : 'bg-gray-100'}`}
                  >
                    <Shield
                      className={`h-5 w-5 ${isCurrent ? 'text-white' : 'text-gray-600'}`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{getRoleName(role)}</h4>
                    {isCurrent && (
                      <Badge variant="default" className="mt-1 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {getRoleDescription(role)}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Permissions</span>
                  <Badge variant="secondary">{permissionCount}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Users</span>
                  <Badge variant="outline">
                    {role === 'super_admin' ? 2 : Math.floor(Math.random() * 10) + 1}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
