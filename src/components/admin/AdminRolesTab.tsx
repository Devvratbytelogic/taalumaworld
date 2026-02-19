/**
 * Admin Roles & Permissions Tab
 * Manage admin roles and permissions (RBAC)
 */

import { Shield, Check, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import type { AdminUser, AdminRole, AdminPermissions } from '../../types/admin';
import { rolePermissions } from '../../types/admin';
import { getRoleName, getRoleDescription } from '../../utils/adminPermissions';

type PermissionKey = keyof AdminPermissions;

interface AdminRolesTabProps {
  adminUser: AdminUser;
}

const ROLES: AdminRole[] = [
  'super_admin',
  'content_manager',
  'support_agent',
  'analytics_manager',
  'finance_manager',
];

const PERMISSION_CATEGORIES: Record<string, PermissionKey[]> = {
  'Dashboard & Pages': ['canViewDashboard', 'canManagePages'],
  'Content': [
    'canManageBooks',
    'canManageChapters',
    'canManageCategories',
    'canManageAuthors',
  ],
  'Users & Access': [
    'canManageUsers',
    'canManageRoles',
    'canViewActivityLogs',
  ],
  'Commerce': ['canManagePayments', 'canViewTransactions'],
  'Moderation': ['canManageReviews', 'canModerateContent'],
  'Analytics': ['canViewAnalytics', 'canViewReports'],
  'System': ['canManageSettings'],
};

function formatPermissionKey(key: PermissionKey): string {
  return key
    .replace(/^can/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function getEnabledPermissions(permissions: AdminPermissions): PermissionKey[] {
  return (Object.entries(permissions) as [PermissionKey, boolean][])
    .filter(([, value]) => value)
    .map(([key]) => key);
}

export function AdminRolesTab({ adminUser }: AdminRolesTabProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Roles & Permissions</h2>
        <p className="text-muted-foreground">Manage admin roles and access control</p>
      </div>

      {/* Current User Role */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary rounded-xl">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Your Current Role</h3>
            <Badge variant="default" className="mb-2">{getRoleName(adminUser.role)}</Badge>
            <p className="text-sm text-muted-foreground">{getRoleDescription(adminUser.role)}</p>
            <div className="mt-4">
              {(() => {
                const enabled = getEnabledPermissions(adminUser.permissions);
                return (
                  <>
                    <p className="text-sm font-medium mb-2">Your Permissions ({enabled.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {enabled.slice(0, 8).map((permission) => (
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
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </Card>

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLES.map((role) => {
          const permissions = rolePermissions[role];
          const permissionCount = getEnabledPermissions(permissions).length;
          const isCurrent = adminUser.role === role;

          return (
            <Card key={role} className={isCurrent ? 'border-primary border-2' : ''}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isCurrent ? 'bg-primary' : 'bg-gray-100'}`}>
                      <Shield className={`h-5 w-5 ${isCurrent ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{getRoleName(role)}</h4>
                      {isCurrent && (
                        <Badge variant="default" className="mt-1 text-xs">Current</Badge>
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
                    <Badge variant="outline">{role === 'super_admin' ? 2 : Math.floor(Math.random() * 10) + 1}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Permission Matrix */}
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
                        {ROLES.map((role) => (
                          <TableHead key={role} className="text-center">
                            <div className="text-xs">{getRoleName(role).split(' ')[0]}</div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissionKeys.map((permissionKey) => (
                        <TableRow key={permissionKey}>
                          <TableCell className="font-medium text-sm">
                            {formatPermissionKey(permissionKey)}
                          </TableCell>
                          {ROLES.map((role) => {
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
    </div>
  );
}