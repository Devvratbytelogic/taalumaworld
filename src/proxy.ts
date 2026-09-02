import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { USER_TYPE, canAccessUserDashboard, isCareerArchitectRole, isMentorRole } from '@/constants/common';
import { getRequiredModelsForPath } from '@/constants/adminRouteAccess';
import { API_BASE_URL } from '@/utils/config';
import {
  getAdminDashboardRoutePath,
  getAdminPortalLoginRoutePath,
  getHomeRoutePath,
  getMentorDashboardRoutePath,
  getMentorLoginRoutePath,
  getMentorRoutePath,
} from '@/routes/routes';

const AUTH_COOKIE_NAME = 'auth_token';
const ROLE_COOKIE_NAME = 'user_role';

const MENTOR_PANEL_PREFIX = getMentorRoutePath(); // '/admin/mentor'
const ADMIN_PANEL_PREFIX = '/admin';
const USER_DASHBOARD_PREFIX = '/user-dashboard';

/** Login / signup pages that must stay reachable no matter the auth state, to avoid redirect loops. */
const PUBLIC_AUTH_ROUTES = ['/portal/login', '/mentor/login', '/mentor/signup', '/mentor/forgot-password'];

function isPublicAuthRoute(pathname: string): boolean {
  return PUBLIC_AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isMentorPanelRoute(pathname: string): boolean {
  return pathname === MENTOR_PANEL_PREFIX || pathname.startsWith(`${MENTOR_PANEL_PREFIX}/`);
}

function isAdminPanelRoute(pathname: string): boolean {
  return (
    (pathname === ADMIN_PANEL_PREFIX || pathname.startsWith(`${ADMIN_PANEL_PREFIX}/`)) &&
    !isMentorPanelRoute(pathname)
  );
}

function isUserDashboardRoute(pathname: string): boolean {
  return pathname === USER_DASHBOARD_PREFIX || pathname.startsWith(`${USER_DASHBOARD_PREFIX}/`);
}

function redirectTo(request: NextRequest, path: string): NextResponse {
  return NextResponse.redirect(new URL(path, request.url));
}

interface AdminProfilePermission {
  model: string;
  permission?: string[] | null;
}

interface AdminProfileResponse {
  data?: {
    role?: { name?: string };
    permission?: AdminProfilePermission[] | null;
  };
}

/**
 * A staff member (any authenticated `/admin/*` role other than Super
 * Administrator or Mentor) can only reach routes whose model has at least
 * one granted permission on their profile — mirrors `useAdminPermissions`.
 */
async function staffHasRouteAccess(pathname: string, token: string): Promise<boolean> {
  const requiredModels = getRequiredModelsForPath(pathname);
  if (!requiredModels) return true; // route has no model (e.g. dashboard, profile) — open to any staff

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API_BASE_URL}/admin/get-profile`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);
    if (!res.ok) return false;

    const body = (await res.json()) as AdminProfileResponse;
    if (body.data?.role?.name === USER_TYPE.SUPER_ADMIN) return true;

    const grantedModels = new Set(
      (body.data?.permission ?? [])
        .filter((entry) => (entry.permission ?? []).length > 0)
        .map((entry) => entry.model),
    );
    return requiredModels.some((model) => grantedModels.has(model));
  } catch {
    // Fail closed: if we can't verify permissions, don't grant access to a modeled route.
    return false;
  }
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (isPublicAuthRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const role = request.cookies.get(ROLE_COOKIE_NAME)?.value;
  const isAuthenticated = Boolean(token);

  // ── Mentor panel: /admin/mentor/* — Mentors only ──────────────────────────
  if (isMentorPanelRoute(pathname)) {
    if (!isAuthenticated) {
      return redirectTo(request, getMentorLoginRoutePath());
    }
    if (!isMentorRole(role)) {
      // Career Architects have no admin access at all; everyone else
      // authenticated here is Super Admin / staff, who belong in /admin.
      const fallback = isCareerArchitectRole(role)
        ? getHomeRoutePath()
        : getAdminDashboardRoutePath();
      return redirectTo(request, fallback);
    }
    return NextResponse.next();
  }

  // ── Admin / staff panel: /admin/* (excluding mentor) ──────────────────────
  if (isAdminPanelRoute(pathname)) {
    if (!isAuthenticated) {
      return redirectTo(request, getAdminPortalLoginRoutePath());
    }
    if (isMentorRole(role)) {
      return redirectTo(request, getMentorDashboardRoutePath());
    }
    if (isCareerArchitectRole(role)) {
      return redirectTo(request, getHomeRoutePath());
    }

    // Remaining authenticated roles are Super Administrator or Super Admin
    // staff (custom roles created via Roles & Permissions). Staff are gated
    // per-route by their assigned permissions.
    if (role !== USER_TYPE.SUPER_ADMIN && token) {
      const allowed = await staffHasRouteAccess(pathname, token);
      if (!allowed) {
        return redirectTo(request, getAdminDashboardRoutePath());
      }
    }
    return NextResponse.next();
  }

  // ── Buyer dashboard: /user-dashboard/* — Career Architects and Mentors ────
  if (isUserDashboardRoute(pathname)) {
    if (!isAuthenticated) {
      return redirectTo(request, getHomeRoutePath());
    }
    if (canAccessUserDashboard(role)) {
      return NextResponse.next();
    }
    // Super Admin / staff belong in /admin, not the marketplace account area.
    if (role) {
      return redirectTo(request, getAdminDashboardRoutePath());
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user-dashboard/:path*'],
};
