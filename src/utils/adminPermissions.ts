import type { AdminUser, AdminRole, AdminSection } from '@/types/admin';

const sectionToPermission: Record<AdminSection, keyof AdminUser['permissions']> = {
  dashboard: 'canViewDashboard',
  pages: 'canManagePages',
  settings: 'canManageSettings',
  books: 'canManageBooks',
  chapters: 'canManageChapters',
  categories: 'canManageCategories',
  authors: 'canManageAuthors',
  users: 'canManageUsers',
  roles: 'canManageRoles',
  activity_logs: 'canViewActivityLogs',
  payments: 'canManagePayments',
  transactions: 'canViewTransactions',
  reviews: 'canManageReviews',
  moderation: 'canModerateContent',
  analytics: 'canViewAnalytics',
  reports: 'canViewReports',
};

export function canAccessSection(adminUser: AdminUser, section: AdminSection): boolean {
  const permissionKey = sectionToPermission[section];
  return adminUser.permissions[permissionKey] ?? false;
}

export function getRoleName(role: AdminRole): string {
  const names: Record<AdminRole, string> = {
    super_admin: 'Super Admin',
    content_manager: 'Content Manager',
    support_agent: 'Support Agent',
    analytics_manager: 'Analytics Manager',
    finance_manager: 'Finance Manager',
  };
  return names[role] ?? role;
}

export function getRoleDescription(role: AdminRole): string {
  const descriptions: Record<AdminRole, string> = {
    super_admin: 'Full access to all admin features and settings.',
    content_manager: 'Manage books, chapters, categories, and authors.',
    support_agent: 'Support users, moderate content, and view activity.',
    analytics_manager: 'View analytics, reports, and activity logs.',
    finance_manager: 'Manage payments, transactions, and financial reports.',
  };
  return descriptions[role] ?? '';
}
