import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_ROLES = ['admin', 'author'];
const USER_ROLES = ['user'];
const ADMIN_PATH_PREFIX = '/admin';
const USER_PROTECTED_PATHS = ['/user-dashboard'];

function isAdminPath(pathname: string): boolean {
    return pathname === ADMIN_PATH_PREFIX || pathname.startsWith(ADMIN_PATH_PREFIX + '/');
}

function isUserProtectedPath(pathname: string): boolean {
    return USER_PROTECTED_PATHS.some(
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
 * - Not logged in         → block /admin/* and /user-dashboard → redirect to /
 * - Logged in as "user"   → block /admin/*                    → redirect to /
 * - Logged in as admin    → block /user-dashboard             → redirect to /
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
    if (!loggedIn && (isAdminPath(pathname) || isUserProtectedPath(pathname))) {
        return redirectToHome();
    }

    if (loggedIn) {
        // User role trying to access admin routes → block
        if (isAdminPath(pathname) && !isAdminRole(userRole)) {
            return redirectToHome();
        }
        // Admin/author trying to access user-dashboard → block
        if (isUserProtectedPath(pathname) && !isUserRole(userRole)) {
            return redirectToHome();
        }
    }

    return NextResponse.next();
}

export const config = {};
