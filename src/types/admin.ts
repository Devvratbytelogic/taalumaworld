export type ContentMode = 'chapters' | 'books';

export type AdminRole = 'admin' | 'author';

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
  | 'orders'
  | 'reviews'
  | 'moderation'
  | 'analytics'
  | 'reports'
  | 'testimonials'
  | 'faqs'
  | 'contact_us'
  | 'subscribers';

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
  canManageOrders: boolean;
  canManageReviews: boolean;
  canModerateContent: boolean;
  canViewAnalytics: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
  canManageTestimonials: boolean;
  canManageFAQs: boolean;
  canManageContactUs: boolean;
  canManageSubscribers: boolean;
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
  admin: {
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
    canManageOrders: true,
    canManageReviews: true,
    canModerateContent: true,
    canViewAnalytics: true,
    canViewReports: true,
    canManageSettings: true,
    canManageTestimonials: true,
    canManageFAQs: true,
    canManageContactUs: true,
    canManageSubscribers: true,
  },
  author: {
    canViewDashboard: false,
    canManagePages: false,
    canManageBooks: true,
    canManageChapters: true,
    canManageCategories: true,
    canManageAuthors: false,
    canManageUsers: false,
    canManageRoles: false,
    canViewActivityLogs: false,
    canManagePayments: false,
    canViewTransactions: false,
    canManageOrders: false,
    canManageReviews: false,
    canModerateContent: false,
    canViewAnalytics: false,
    canViewReports: false,
    canManageSettings: false,
    canManageTestimonials: false,
    canManageFAQs: false,
    canManageContactUs: false,
    canManageSubscribers: false,
  },
};
