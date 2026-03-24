import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_ROLES = ['admin', 'author'];
const ADMIN_PATH_PREFIX = '/admin';

function isAdminPath(pathname: string): boolean {
    return pathname === ADMIN_PATH_PREFIX || pathname.startsWith(ADMIN_PATH_PREFIX + '/');
}

function isAdminRole(role: string | undefined): boolean {
    return ADMIN_ROLES.includes(role?.trim().toLowerCase() ?? '');
}

/**
 * Route protection by role (used by middleware):
 * - Not logged in: block /admin and /admin/*; redirect to /.
 * - Non-Admin (logged in): block /admin and /admin/*; redirect to /.
 */
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const authToken = request.cookies.get('auth_token')?.value?.trim();
    const userRole = request.cookies.get('user_role')?.value?.trim();

    // Skip internal and static
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
        return NextResponse.next();
    }

    const loggedIn = !!authToken;

    // Not logged in: block admin routes
    if (!loggedIn && isAdminPath(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    if (loggedIn && !isAdminRole(userRole)) {
        // Non-Admin: block admin routes
        if (isAdminPath(pathname)) {
            const url = request.nextUrl.clone();
            url.pathname = '/';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {};
