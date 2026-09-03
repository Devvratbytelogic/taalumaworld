'use client';
import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import PrimaryHeader from '@/components/layout/header/PrimaryHeader';
import PrimaryFooter from '@/components/layout/footer/PrimaryFooter';
import { useAuth } from '@/hooks/useAuth';
import { getUserRole } from '@/utils/authCookies';
import { hasSocialOAuthCallbackParams } from '@/utils/socialAuth';

export default function ConditionalSiteLayout({
    children,
    logo,
    contentMode,
}: {
    children: React.ReactNode;
    logo: string;
    contentMode: string;
}) {
    return (
        <Suspense fallback={<SiteChrome logo={logo} contentMode={contentMode} hideChrome={false}>{children}</SiteChrome>}>
            <SiteChromeWithOAuth logo={logo} contentMode={contentMode}>
                {children}
            </SiteChromeWithOAuth>
        </Suspense>
    );
}

function SiteChromeWithOAuth({
    children,
    logo,
    contentMode,
}: {
    children: React.ReactNode;
    logo: string;
    contentMode: string;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isAdminRoute = pathname.startsWith('/admin');
    const isPortalRoute = pathname.startsWith('/portal');
    const isAuthCallbackRoute = pathname.startsWith('/auth/');
    const isLinkedInOriginCallback = pathname === '/' && hasSocialOAuthCallbackParams(searchParams);
    const hideChrome = isAdminRoute || isPortalRoute || isAuthCallbackRoute || isLinkedInOriginCallback;

    return (
        <SiteChrome logo={logo} contentMode={contentMode} hideChrome={hideChrome}>
            {children}
        </SiteChrome>
    );
}

function SiteChrome({
    children,
    logo,
    contentMode,
    hideChrome,
}: {
    children: React.ReactNode;
    logo: string;
    contentMode: string;
    hideChrome: boolean;
}) {
    const { isAuthenticated, user } = useAuth();
    const userRole = user?.role ?? getUserRole() ?? '';

    return (
        <>
            {!hideChrome && (
                <PrimaryHeader
                    logo={logo}
                    isAuthenticated={isAuthenticated}
                    userRole={userRole}
                    contentMode={contentMode}
                />
            )}
            {children}
            {!hideChrome && <PrimaryFooter />}
        </>
    );
}
