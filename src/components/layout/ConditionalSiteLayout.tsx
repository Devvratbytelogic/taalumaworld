'use client';
import { Suspense, type ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import PrimaryHeader from '@/components/layout/header/PrimaryHeader';
import PrimaryFooter from '@/components/layout/footer/PrimaryFooter';
import { useAuth } from '@/hooks/useAuth';
import { getUserRole } from '@/utils/authCookies';
import { hasSocialOAuthCallbackParams } from '@/utils/socialAuth';
import type { IGlobalSettings } from '@/types/globalSettings';

type SiteLayoutProps = {
    children: ReactNode;
    logo: string;
    contentMode: string;
    settings: IGlobalSettings | null;
};

export default function ConditionalSiteLayout({
    children,
    logo,
    contentMode,
    settings,
}: SiteLayoutProps) {
    return (
        <Suspense fallback={<SiteChrome logo={logo} contentMode={contentMode} settings={settings} hideChrome={false}>{children}</SiteChrome>}>
            <SiteChromeWithOAuth logo={logo} contentMode={contentMode} settings={settings}>
                {children}
            </SiteChromeWithOAuth>
        </Suspense>
    );
}

function SiteChromeWithOAuth({
    children,
    logo,
    contentMode,
    settings,
}: SiteLayoutProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isAdminRoute = pathname.startsWith('/admin');
    const isPortalRoute = pathname.startsWith('/portal');
    const isAuthCallbackRoute = pathname.startsWith('/auth/');
    const isLinkedInOriginCallback = pathname === '/' && hasSocialOAuthCallbackParams(searchParams);
    const hideChrome = isAdminRoute || isPortalRoute || isAuthCallbackRoute || isLinkedInOriginCallback;

    return (
        <SiteChrome logo={logo} contentMode={contentMode} settings={settings} hideChrome={hideChrome}>
            {children}
        </SiteChrome>
    );
}

function SiteChrome({
    children,
    logo,
    contentMode,
    settings,
    hideChrome,
}: SiteLayoutProps & { hideChrome: boolean }) {
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
            {!hideChrome && <PrimaryFooter settings={settings} />}
        </>
    );
}
