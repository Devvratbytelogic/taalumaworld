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
  { path: '/admin/referral-setting', models: ['Referral Setting'] },
  { path: '/admin/roles-and-permissions', models: ['Roles', 'Permissions', 'Staff'] },
  { path: '/admin/audit-logs', models: ['Audit Log'] },
  { path: '/admin/transactions', models: ['Transactions'] },
  { path: '/admin/orders', models: ['Orders'] },
  { path: '/admin/coupons', models: ['Coupon'] },
  { path: '/admin/taxes', models: ['Taxes'] },
  { path: '/admin/withdrawal-requests', models: ['Withdrawal', 'Withdrawal Request'] },
  { path: '/admin/users', models: ['Users'] },
  { path: '/admin/staff', models: ['Staff'] },
  {
    path: '/admin/institutions',
    models: ['Institutions', 'Institution Access', 'Institute Usage Report', 'Institute Registration Prompt'],
  },
  { path: '/admin/applications/mentors', models: ['Mentor Application'] },
  { path: '/admin/types/mentor-types', models: ['Mentor Tier'] },
  { path: '/admin/application-mentor-verification', models: ['Mentor Verification'] },
  { path: '/admin/application-mentor-tier-upgrades', models: ['Mentor Tier Upgrade'] },
  { path: '/admin/affiliate-applications', models: ['Affiliate Application'] },
  { path: '/admin/authors', models: ['Mentors'] },
  { path: '/admin/series', models: ['Series'] },
  { path: '/admin/blueprints', models: ['Blueprints'] },
  { path: '/admin/reviews', models: ['Reviews'] },
  { path: '/admin/agreements/agreement-types', models: ['Agreement Types'] },
  { path: '/admin/agreements/sentences', models: ['Agreements'] },
  { path: '/admin/agreements', models: ['Agreements'] },
  { path: '/admin/testimonials', models: ['Testimonial'] },
  { path: '/admin/faqs', models: ['FAQs'] },
  { path: '/admin/all-contact-us', models: ['Contact Us'] },
  { path: '/admin/subscribers', models: ['Subscribers'] },
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
