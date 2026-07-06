// ─── Static Routes ─────────────────────────────────────────────────────────

export function getHomeRoutePath(): string {
  return '/';
}


export function getSeriesRoutePath(slug: string): string {
  return `/series/${slug}`;
}

export function getBlueprintRoutePath(slug: string): string {
  return `/blueprint/${slug}`;
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
export function getMentorRoutePath(): string {
  return '/admin/mentor';
}
export function getMentorDashboardRoutePath(): string {
  return '/admin/mentor/dashboard';
}

export function getMentorBlueprintPerformanceRoutePath(): string {
  return '/admin/mentor/blueprint-performance';
}

export function getMentorSalesVolumeRoutePath(): string {
  return '/admin/mentor/sales-volume';
}

export function getMentorRevenueEarnedRoutePath(): string {
  return '/admin/mentor/revenue-earned';
}

export function getMentorRevenuePendingRoutePath(): string {
  return '/admin/mentor/revenue-pending';
}

export function getMentorPaymentHistoryRoutePath(): string {
  return '/admin/mentor/payment-history';
}

export function getMentorStatementsRoutePath(): string {
  return '/admin/mentor/statements';
}

export function getMentorRevenueByBlueprintRoutePath(): string {
  return '/admin/mentor/revenue-by-blueprint';
}

export function getMentorWalletRoutePath(): string {
  return '/admin/mentor/wallet';
}

export function getMentorReferralsRoutePath(): string {
  return '/admin/mentor/referrals';
}

export function getMentorCouponsRoutePath(): string {
  return '/admin/mentor/coupons';
}

export function getMentorBooksRoutePath(): string {
  return '/admin/mentor/books';
}

export function getMentorChaptersRoutePath(): string {
  return '/admin/mentor/chapters';
}

export function getMentorCategoriesRoutePath(): string {
  return '/admin/mentor/categories';
}

export function getMentorUsersRoutePath(): string {
  return '/admin/mentor/users';
}

export function getMentorLoginRoutePath(): string {
  return '/mentor/login';
}

export function getMentorSignupRoutePath(): string {
  return '/mentor/signup';
}

export function getMentorForgotPasswordRoutePath(): string {
  return '/mentor/forgot-password';
}

export function getMentorResetPasswordRoutePath(): string {
  return '/mentor/reset-password';
}

export function getMentorVerifyRoutePath(
  params: { email: string; type: 'account' | 'verify' },
): string {
  const search = new URLSearchParams({ email: params.email, type: params.type });
  return `/mentor/verify?${search.toString()}`;
}

/** Hidden administrator login — not linked on the public site */
export function getAdminPortalLoginRoutePath(): string {
  return '/portal/login';
}

export function getAdminMentorTypesRoutePath(): string {
  return '/admin/types/mentor-types';
}

export function getAdminMentorApplicationsRoutePath(): string {
  return '/admin/applications/mentors';
}

export function getAdminProfileRoutePath(): string {
  return '/admin/profile';
}

export function getMentorProfileRoutePath(): string {
  return '/admin/mentor/profile';
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
    mentor_types: '/admin/types/mentor-types',
    mentor_applications: '/admin/applications/mentors',
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

export function getUserDashboardProfileRoutePath(): string {
  return '/user-dashboard/profile';
}

export function getUserDashboardMyChaptersRoutePath(): string {
  return '/user-dashboard/my-chapters';
}

export function getUserDashboardMyBooksRoutePath(): string {
  return '/user-dashboard/my-books';
}

export function getUserDashboardHistoryRoutePath(): string {
  return '/user-dashboard/history';
}

export function getUserDashboardBecomeMentorRoutePath(): string {
  return '/user-dashboard/become-mentor';
}

export function getUserDashboardSettingsRoutePath(): string {
  return '/user-dashboard/settings';
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
