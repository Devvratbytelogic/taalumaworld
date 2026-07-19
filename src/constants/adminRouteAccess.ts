/**
 * Maps `/admin/*` route prefixes (excluding `/admin/mentor/*`, which is its own
 * panel) to the permission "model(s)" required to access them.
 *
 * This mirrors the `model` / `submodel` values declared on `NAV_GROUPS` in
 * `src/app/admin/layout.tsx` — keep both in sync when adding a new admin
 * section. Routes not listed here (e.g. dashboard, profile) have no
 * associated model and are accessible to any authenticated staff member,
 * matching `useAdminPermissions().hasAccess(undefined) === true`.
 */
export interface AdminRouteModelMapping {
  /** Route prefix, matched against `pathname === path || pathname.startsWith(path + '/')`. */
  path: string;
  /** Access is granted if any one of these models has a permission entry. */
  models: string[];
}

export const ADMIN_ROUTE_MODEL_MAP: AdminRouteModelMapping[] = [
  { path: '/admin/settings', models: ['Setting'] },
  { path: '/admin/roles-and-permissions', models: ['Role', 'Permission', 'Staff'] },
  { path: '/admin/transactions', models: ['Transaction'] },
  { path: '/admin/orders', models: ['Order'] },
  { path: '/admin/coupons', models: ['Coupon'] },
  { path: '/admin/withdrawal-requests', models: ['Withdrawal Request'] },
  { path: '/admin/users', models: ['User'] },
  {
    path: '/admin/institutions',
    models: ['Institutions', 'Institution Access', 'Institute Usage Report', 'Institute Registration Prompt'],
  },
  { path: '/admin/applications/mentors', models: ['Mentor Application'] },
  { path: '/admin/types/mentor-types', models: ['Mentor Tier'] },
  { path: '/admin/application-mentor-verification', models: ['Mentor Verification'] },
  { path: '/admin/application-mentor-tier-upgrades', models: ['Mentor Tier Upgrade'] },
  { path: '/admin/affiliate-applications', models: ['Affiliate Application'] },
  { path: '/admin/authors', models: ['Mentor'] },
  { path: '/admin/series', models: ['Series'] },
  { path: '/admin/blueprints', models: ['Blueprint'] },
  { path: '/admin/agreements/agreement-types', models: ['Agreement Type'] },
  { path: '/admin/agreements', models: ['Agreement'] },
  { path: '/admin/testimonials', models: ['Testimonial'] },
  { path: '/admin/faqs', models: ['FAQs'] },
  { path: '/admin/all-contact-us', models: ['Contact Us'] },
  { path: '/admin/subscribers', models: ['Subscriber'] },
];

/**
 * Returns the model(s) required to access `pathname`, or `null` when the
 * route has no associated model (freely accessible to any staff member).
 * Matches the most specific (longest) prefix first, so nested routes like
 * `/admin/agreements/agreement-types` resolve before their parent
 * `/admin/agreements`.
 */
export function getRequiredModelsForPath(pathname: string): string[] | null {
  const match = [...ADMIN_ROUTE_MODEL_MAP]
    .sort((a, b) => b.path.length - a.path.length)
    .find((entry) => pathname === entry.path || pathname.startsWith(`${entry.path}/`));

  return match?.models ?? null;
}
