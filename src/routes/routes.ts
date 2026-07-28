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

export function getPolicyBySlugRoutePath(slug: string): string {
  return `/policies/${slug}`;
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

export function getMentorRevenueByBlueprintRoutePath(): string {
  return '/admin/mentor/revenue-by-blueprint';
}

export function getMentorWalletRoutePath(): string {
  return '/admin/mentor/wallet';
}

export function getMentorReferralsRoutePath(): string {
  return '/admin/mentor/referrals';
}

export function getMentorFollowersRoutePath(): string {
  return '/admin/mentor/follower';
}

export function getMentorBooksRoutePath(): string {
  return '/admin/mentor/series';
}

export function getMentorChaptersRoutePath(): string {
  return '/admin/mentor/blueprints';
}

export function getMentorReviewsRoutePath(): string {
  return '/admin/mentor/reviews';
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

export function getAdminMentorDetailRoutePath(id: string): string {
  return `/admin/authors/${id}`;
}

export function getAdminSectionRoutePath(section: string): string {
  const map: Record<string, string> = {
    dashboard: '/admin/dashboard',
    pages: '/admin/pages',
    settings: '/admin/settings',
    books: '/admin/series',
    chapters: '/admin/blueprints',
    categories: '/admin/categories',
    authors: '/admin/authors',
    mentor_types: '/admin/types/mentor-types',
    mentor_applications: '/admin/applications/mentors',
    mentor_verification: '/admin/application-mentor-verification',
    mentor_tier_upgrades: '/admin/application-mentor-tier-upgrades',
    users: '/admin/users',
    staff: '/admin/staff',
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
    agreements: '/admin/agreements',
    agreement_types: '/admin/agreements/agreement-types',
    audit_logs: '/admin/audit-logs',
    coupons: '/admin/coupons',
    taxes: '/admin/taxes',
    withdrawal_requests: '/admin/withdrawal-requests',
    affiliate_applications: '/admin/affiliate-applications',
  };
  return map[section] ?? '/admin/dashboard';
}

export function getCreateChapterRoutePath(isMentor: boolean = false): string {
  return isMentor ? '/admin/mentor/blueprints/create' : '/admin/blueprints/create';
}

export function getEditChapterRoutePath(chapterId: string, isMentor: boolean = false): string {
  return isMentor ? `/admin/mentor/blueprints/edit/${chapterId}` : `/admin/blueprints/edit/${chapterId}`;
}

export function getViewChapterRoutePath(chapterId: string, isMentor: boolean = false): string {
  return isMentor ? `/admin/mentor/blueprints/view/${chapterId}` : `/admin/blueprints/view/${chapterId}`;
}

/** List/back destination for blueprints — mentor panel vs admin panel. */
export function getChaptersListRoutePath(isMentor: boolean = false): string {
  return isMentor ? getMentorChaptersRoutePath() : getAdminSectionRoutePath('chapters');
}

export function getViewAuditLogRoutePath(auditLogId: string): string {
  return `/admin/audit-logs/${auditLogId}`;
}

export function getViewOrderRoutePath(orderId: string): string {
  return `/admin/orders/${orderId}`;
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

export function getUserDashboardMyWishlistRoutePath(): string {
  return '/user-dashboard/my-wishlist';
}

export function getUserDashboardFollowedMentorsRoutePath(): string {
  return '/user-dashboard/followed-mentors';
}

export function getUserDashboardMyReviewsRoutePath(): string {
  return '/user-dashboard/my-reviews';
}

export function getUserDashboardHistoryRoutePath(): string {
  return '/user-dashboard/history';
}

export function getUserDashboardBecomeMentorRoutePath(): string {
  return '/user-dashboard/become-mentor';
}

export function getUserDashboardMyReferralsRoutePath(): string {
  return '/user-dashboard/my-referrals';
}

export function getUserDashboardSettingsRoutePath(): string {
  return '/user-dashboard/settings';
}

export function getUserDashboardAddressRoutePath(): string {
  return '/user-dashboard/address';
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

export function getAllAuthorsRoutePath(): string {
  return '/mentor';
}

export function getSingleAuthorRoutePath(id: string): string {
  return `/mentor/${id}`;
}

export function getMyChaptersRoutePath(): string {
  return '/my-chapters';
}

export function getMyBooksRoutePath(): string {
  return '/my-books';
}
