// ─── Static Routes ─────────────────────────────────────────────────────────

export function getHomeRoutePath(): string {
  return '/';
}

export function getAboutUsRoutePath(): string {
  return '/why-taaluma-exists';
}

export function getContactUsRoutePath(): string {
  return '/contact-us';
}

export function getFAQRoutePath(): string {
  return '/faq';
}

export function getPrivacyPolicyRoutePath(): string {
  return '/policies/privacy-policy';
}

export function getTermsOfServiceRoutePath(): string {
  return '/policies/terms-of-service';
}

export function getMentorAgreementRoutePath(): string {
  return '/policies/mentor-agreement';
}

export function getRevenueShareAgreementRoutePath(): string {
  return '/policies/revenue-share-agreement';
}

export function getContentOwnershipLicensingRoutePath(): string {
  return '/policies/content-ownership-licensing';
}

export function getCommunityStandardsRoutePath(): string {
  return '/policies/community-standards';
}

export function getInstitutionalAccessTermsRoutePath(): string {
  return '/policies/institutional-access-terms';
}

export function getRefundPolicyRoutePath(): string {
  return '/policies/refund-policy';
}

export function getAdminRoutePath(): string {
  return '/admin';
}

export function getAdminDashboardRoutePath(): string {
  return '/admin/dashboard';
}

export function getAdminProfileRoutePath(): string {
  return '/admin/profile';
}

export function getAdminSectionRoutePath(section: string): string {
  const map: Record<string, string> = {
    dashboard: '/admin/dashboard',
    pages: '/admin/pages',
    settings: '/admin/settings',
    books: '/admin/books',
    chapters: '/admin/chapters',
    categories: '/admin/categories',
    authors: '/admin/authors',
    users: '/admin/users',
    activity_logs: '/admin/activity-logs',
    payments: '/admin/payments',
    transactions: '/admin/transactions',
    orders: '/admin/orders',
    reviews: '/admin/reviews',
    testimonials: '/admin/testimonials',
    faqs: '/admin/faqs',
    contact_us: '/admin/all-contact-us',
    subscribers: '/admin/subscribers',
    institutions: '/admin/institutions',
    roles_permissions: '/admin/roles-and-permissions',
    moderation: '/admin/moderation',
    analytics: '/admin/analytics',
    reports: '/admin/reports',
  };
  return map[section] ?? '/admin/dashboard';
}

export function getCreateChapterRoutePath(): string {
  return '/admin/chapter/create';
}

export function getEditChapterRoutePath(chapterId: string): string {
  return `/admin/chapter/edit/${chapterId}`;
}

export function getDesignSystemRoutePath(): string {
  return '/design-system';
}

export function getUserDashboardRoutePath(): string {
  return '/user-dashboard';
}

export function getCartRoutePath(): string {
  return '/cart';
}

export function getCartCheckoutRoutePath(): string {
  return '/cart/checkout';
}

export function getCategoriesRoutePath(): string {
  return '/categories';
}

export function getAuthorsRoutePath(params?: { id?: string }): string {
  const base = '/authors';
  if (params?.id) {
    return `${base}?id=${encodeURIComponent(params.id)}`;
  }
  return base;
}

export function getMyChaptersRoutePath(): string {
  return '/my-chapters';
}

export function getMyBooksRoutePath(): string {
  return '/my-books';
}

// export function getSearchRoutePath(query: string): string {
//   return `/search?q=${encodeURIComponent(query)}`;
// }

// ─── Dynamic Routes ────────────────────────────────────────────────────────

export function getReadChapterRoutePath(chapterId: string): string {
  return `/read-chapter/${chapterId}`;
}

export function getReadBookRoutePath(bookId: string): string {
  return `/read-book/${bookId}`;
}

export function getHomeWithSelectionRoutePath(selectedChapterId: string, selectedBookId: string): string {
  return `/?selectedChapterId=${selectedChapterId}&selectedBookId=${selectedBookId}`;
}
