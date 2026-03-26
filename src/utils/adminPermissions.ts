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
  testimonials: 'canManageTestimonials',
  faqs: 'canManageFAQs',
  contact_us: 'canManageContactUs',
};

export function canAccessSection(adminUser: AdminUser, section: AdminSection): boolean {
  const permissionKey = sectionToPermission[section];
  return adminUser.permissions[permissionKey] ?? false;
}

export function getRoleName(role: AdminRole | string): string {
  const names: Record<string, string> = {
    admin: 'Admin',
    Admin: 'Admin',
    author: 'Author',
    Author: 'Author',
  };
  return names[role] ?? role;
}

export function getRoleDescription(role: AdminRole | string): string {
  const descriptions: Record<string, string> = {
    admin: 'Full access to all admin features and settings.',
    Admin: 'Full access to all admin features and settings.',
    author: 'Manage books, chapters, and categories.',
    Author: 'Manage books, chapters, and categories.',
  };
  return descriptions[role] ?? '';
}
