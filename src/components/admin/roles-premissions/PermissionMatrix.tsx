import { Check, X } from 'lucide-react';
import { Card } from '../../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { getRoleName } from '@/utils/adminPermissions';
import { rolePermissions } from '@/types/admin';
import type { AdminRole } from '@/types/admin';
import { ROLES, PERMISSION_CATEGORIES, formatPermissionKey } from './rolesConstants';
import type { PermissionKey } from './rolesConstants';

export function PermissionMatrix() {
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Permission Matrix</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Overview of permissions for each role
        </p>

        <div className="space-y-6">
          {Object.entries(PERMISSION_CATEGORIES).map(([category, permissionKeys]) => (
            <div key={category}>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">
                {category}
              </h4>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-62.5">Permission</TableHead>
                      {ROLES.map((role: AdminRole) => (
                        <TableHead key={role} className="text-center">
                          <div className="text-xs">
                            {getRoleName(role).split(' ')[0]}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissionKeys.map((permissionKey: PermissionKey) => (
                      <TableRow key={permissionKey}>
                        <TableCell className="font-medium text-sm">
                          {formatPermissionKey(permissionKey)}
                        </TableCell>
                        {ROLES.map((role: AdminRole) => {
                          const hasPermission = rolePermissions[role][permissionKey];
                          return (
                            <TableCell key={role} className="text-center">
                              {hasPermission ? (
                                <div className="flex justify-center">
                                  <div className="p-1 bg-green-50 rounded">
                                    <Check className="h-4 w-4 text-green-600" />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-center">
                                  <div className="p-1 bg-gray-50 rounded">
                                    <X className="h-4 w-4 text-gray-300" />
                                  </div>
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
