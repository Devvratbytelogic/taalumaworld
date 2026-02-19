export type ContentMode = 'chapters' | 'books';

export type AdminRole =
  | 'super_admin'
  | 'content_manager'
  | 'support_agent'
  | 'analytics_manager'
  | 'finance_manager';

export type AdminSection =
  | 'dashboard'
  | 'pages'
  | 'settings'
  | 'books'
  | 'chapters'
  | 'categories'
  | 'authors'
  | 'users'
  | 'roles'
  | 'activity_logs'
  | 'payments'
  | 'transactions'
  | 'reviews'
  | 'moderation'
  | 'analytics'
  | 'reports';

export type AdminPermissions = {
  canViewDashboard: boolean;
  canManagePages: boolean;
  canManageBooks: boolean;
  canManageChapters: boolean;
  canManageCategories: boolean;
  canManageAuthors: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;
  canViewActivityLogs: boolean;
  canManagePayments: boolean;
  canViewTransactions: boolean;
  canManageReviews: boolean;
  canModerateContent: boolean;
  canViewAnalytics: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
};

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: AdminPermissions;
  avatar: string;
  createdAt: Date;
  lastActive: Date;
}

export const rolePermissions: Record<AdminRole, AdminPermissions> = {
  super_admin: {
    canViewDashboard: true,
    canManagePages: true,
    canManageBooks: true,
    canManageChapters: true,
    canManageCategories: true,
    canManageAuthors: true,
    canManageUsers: true,
    canManageRoles: true,
    canViewActivityLogs: true,
    canManagePayments: true,
    canViewTransactions: true,
    canManageReviews: true,
    canModerateContent: true,
    canViewAnalytics: true,
    canViewReports: true,
    canManageSettings: true,
  },
  content_manager: {
    canViewDashboard: true,
    canManagePages: true,
    canManageBooks: true,
    canManageChapters: true,
    canManageCategories: true,
    canManageAuthors: true,
    canManageUsers: false,
    canManageRoles: false,
    canViewActivityLogs: false,
    canManagePayments: false,
    canViewTransactions: false,
    canManageReviews: true,
    canModerateContent: true,
    canViewAnalytics: true,
    canViewReports: true,
    canManageSettings: false,
  },
  support_agent: {
    canViewDashboard: true,
    canManagePages: false,
    canManageBooks: false,
    canManageChapters: false,
    canManageCategories: false,
    canManageAuthors: false,
    canManageUsers: true,
    canManageRoles: false,
    canViewActivityLogs: true,
    canManagePayments: false,
    canViewTransactions: true,
    canManageReviews: true,
    canModerateContent: true,
    canViewAnalytics: false,
    canViewReports: false,
    canManageSettings: false,
  },
  analytics_manager: {
    canViewDashboard: true,
    canManagePages: false,
    canManageBooks: false,
    canManageChapters: false,
    canManageCategories: false,
    canManageAuthors: false,
    canManageUsers: false,
    canManageRoles: false,
    canViewActivityLogs: true,
    canManagePayments: false,
    canViewTransactions: true,
    canManageReviews: false,
    canModerateContent: false,
    canViewAnalytics: true,
    canViewReports: true,
    canManageSettings: false,
  },
  finance_manager: {
    canViewDashboard: true,
    canManagePages: false,
    canManageBooks: false,
    canManageChapters: false,
    canManageCategories: false,
    canManageAuthors: false,
    canManageUsers: false,
    canManageRoles: false,
    canViewActivityLogs: false,
    canManagePayments: true,
    canViewTransactions: true,
    canManageReviews: false,
    canModerateContent: false,
    canViewAnalytics: true,
    canViewReports: true,
    canManageSettings: false,
  },
};
