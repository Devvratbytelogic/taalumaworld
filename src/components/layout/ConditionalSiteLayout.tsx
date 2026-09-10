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

function isChromeHiddenPath(pathname: string) {
    return pathname.startsWith('/admin') || pathname.startsWith('/portal') || pathname.startsWith('/auth/');
}

export default function ConditionalSiteLayout({
    children,
    logo,
    contentMode,
    settings,
}: SiteLayoutProps) {
    const pathname = usePathname();
    const hideChromeByPath = isChromeHiddenPath(pathname);

    if (pathname === '/') {
        return (
            <Suspense
                fallback={
                    <SiteChrome logo={logo} contentMode={contentMode} settings={settings} hideChrome={false}>
                        {children}
                    </SiteChrome>
                }
            >
                <HomeSiteChrome logo={logo} contentMode={contentMode} settings={settings}>
                    {children}
                </HomeSiteChrome>
            </Suspense>
        );
    }

    return (
        <SiteChrome logo={logo} contentMode={contentMode} settings={settings} hideChrome={hideChromeByPath}>
            {children}
        </SiteChrome>
    );
}

function HomeSiteChrome({
    children,
    logo,
    contentMode,
    settings,
}: SiteLayoutProps) {
    const searchParams = useSearchParams();
    const hideChrome = hasSocialOAuthCallbackParams(searchParams);

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
