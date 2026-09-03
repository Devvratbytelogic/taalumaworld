'use client';
import { usePathname } from 'next/navigation';
import PrimaryHeader from '@/components/layout/header/PrimaryHeader';
import PrimaryFooter from '@/components/layout/footer/PrimaryFooter';
import { useAuth } from '@/hooks/useAuth';
import { getUserRole } from '@/utils/authCookies';

export default function ConditionalSiteLayout({
    children,
    logo,
    contentMode,
}: {
    children: React.ReactNode;
    logo: string;
    contentMode: string;
}) {
    const pathname = usePathname();
    const { isAuthenticated, user } = useAuth();
    const userRole = user?.role ?? getUserRole() ?? '';
    const isAdminRoute = pathname.startsWith('/admin');
    const isPortalRoute = pathname.startsWith('/portal');
    const isAuthCallbackRoute = pathname.startsWith('/auth/');
    const hideSiteChrome = isAdminRoute || isPortalRoute || isAuthCallbackRoute;

    return (
        <>
            {!hideSiteChrome && (
                <PrimaryHeader
                    logo={logo}
                    isAuthenticated={isAuthenticated}
                    userRole={userRole}
                    contentMode={contentMode}
                />
            )}
            {children}
            {!hideSiteChrome && <PrimaryFooter />}
        </>
    );
}
