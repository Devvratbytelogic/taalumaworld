import type { AdminRole, AdminPermissions } from '@/types/admin';

export type PermissionKey = keyof AdminPermissions;

export const ROLES: AdminRole[] = [
  'super_admin',
  'content_manager',
  'support_agent',
  'analytics_manager',
  'finance_manager',
];

export const PERMISSION_CATEGORIES: Record<string, PermissionKey[]> = {
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

export function formatPermissionKey(key: PermissionKey): string {
  return key
    .replace(/^can/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function getEnabledPermissions(permissions: AdminPermissions): PermissionKey[] {
  return (Object.entries(permissions) as [PermissionKey, boolean][])
    .filter(([, value]) => value)
    .map(([key]) => key);
}
