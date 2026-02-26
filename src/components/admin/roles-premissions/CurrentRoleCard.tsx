import { Shield } from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { getRoleName, getRoleDescription } from '@/utils/adminPermissions';
import type { AdminUser } from '@/types/admin';
import { getEnabledPermissions, formatPermissionKey } from './rolesConstants';
import type { PermissionKey } from './rolesConstants';

interface CurrentRoleCardProps {
  adminUser: AdminUser;
}

export function CurrentRoleCard({ adminUser }: CurrentRoleCardProps) {
  const enabled = getEnabledPermissions(adminUser.permissions);

  return (
    <Card className="p-6 bg-primary/5 border-primary/20">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary rounded-xl">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Your Current Role</h3>
          <Badge variant="default" className="mb-2">
            {getRoleName(adminUser.role)}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {getRoleDescription(adminUser.role)}
          </p>
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Your Permissions ({enabled.length})</p>
            <div className="flex flex-wrap gap-2">
              {enabled.slice(0, 8).map((permission: PermissionKey) => (
                <Badge key={permission} variant="secondary" className="text-xs">
                  {formatPermissionKey(permission)}
                </Badge>
              ))}
              {enabled.length > 8 && (
                <Badge variant="outline" className="text-xs">
                  +{enabled.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
