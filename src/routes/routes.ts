// ─── Static Routes ─────────────────────────────────────────────────────────

export function getHomeRoutePath(): string {
  return '/';
}

export function getAboutUsRoutePath(): string {
  return '/about-us';
}

export function getContactUsRoutePath(): string {
  return '/contact-us';
}

export function getFAQRoutePath(): string {
  return '/faq';
}

export function getPrivacyPolicyRoutePath(): string {
  return '/privacy-policy';
}

export function getTermsOfServiceRoutePath(): string {
  return '/terms-of-service';
}

export function getAdminRoutePath(): string {
  return '/admin';
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

export function getBooksRoutePath(params?: { id?: string }): string {
  const base = '/books';
  if (params?.id) {
    return `${base}?id=${encodeURIComponent(params.id)}`;
  }
  return base;
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

export function getSearchRoutePath(query: string): string {
  return `/search?q=${encodeURIComponent(query)}`;
}

// ─── Dynamic Routes ────────────────────────────────────────────────────────

export function getReadChapterRoutePath(chapterId: string): string {
  return `/read-chapter/${chapterId}`;
}

export function getHomeWithSelectionRoutePath(selectedChapterId: string, selectedBookId: string): string {
  return `/?selectedChapterId=${selectedChapterId}&selectedBookId=${selectedBookId}`;
}
