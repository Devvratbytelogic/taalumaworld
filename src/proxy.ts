import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_ROLES = ['admin', 'author'];
const USER_ROLES = ['user'];
const ADMIN_PATH_PREFIX = '/admin';
/** Paths accessible only by the "user" role (not admin/author) */
const USER_ROLE_ONLY_PATHS = ['/user-dashboard'];
/** Paths that require any authenticated user, regardless of role */
const AUTH_REQUIRED_PATHS = ['/read-book', '/read-chapter'];

function isAdminPath(pathname: string): boolean {
    return pathname === ADMIN_PATH_PREFIX || pathname.startsWith(ADMIN_PATH_PREFIX + '/');
}

function isUserRoleOnlyPath(pathname: string): boolean {
    return USER_ROLE_ONLY_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + '/')
    );
}

function isAuthRequiredPath(pathname: string): boolean {
    return AUTH_REQUIRED_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + '/')
    );
}

function isAdminRole(role: string | undefined): boolean {
    return ADMIN_ROLES.includes(role?.trim().toLowerCase() ?? '');
}

function isUserRole(role: string | undefined): boolean {
    return USER_ROLES.includes(role?.trim().toLowerCase() ?? '');
}

/**
 * Route protection by role (used by middleware):
 * - Not logged in         → block /admin/*, /user-dashboard, /read-book/*, /read-chapter/* → redirect to /
 * - Logged in as "user"   → block /admin/*                    → redirect to /
 * - Logged in as admin    → block /user-dashboard             → redirect to /
 * - Any logged-in role    → allow /read-book/*, /read-chapter/*
 */
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const authToken = request.cookies.get('auth_token')?.value?.trim();
    const userRole = request.cookies.get('user_role')?.value?.trim();

    // Skip Next.js internals, API routes, and static assets
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
        return NextResponse.next();
    }

    const loggedIn = !!authToken;

    const redirectToHome = () => {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    };

    // Not logged in: block all protected routes
    if (!loggedIn && (isAdminPath(pathname) || isUserRoleOnlyPath(pathname) || isAuthRequiredPath(pathname))) {
        return redirectToHome();
    }

    if (loggedIn) {
        // User role trying to access admin routes → block
        if (isAdminPath(pathname) && !isAdminRole(userRole)) {
            return redirectToHome();
        }
        // Admin/author trying to access user-only dashboard → block
        if (isUserRoleOnlyPath(pathname) && !isUserRole(userRole)) {
            return redirectToHome();
        }
        // /read-book and /read-chapter are open to any authenticated role
    }

    return NextResponse.next();
}

export const config = {};
