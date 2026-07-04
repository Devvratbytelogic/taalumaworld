'use client';
import { usePathname } from 'next/navigation';
import PrimaryHeader from '@/components/layout/header/PrimaryHeader';
import PrimaryFooter from '@/components/layout/footer/PrimaryFooter';

export default function ConditionalSiteLayout({ children, isAuthenticated, userRole, logo, contentMode }: { children: React.ReactNode, isAuthenticated: boolean, userRole: string, logo: string, contentMode: string }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');
    const isPortalRoute = pathname.startsWith('/portal');
    const hideSiteChrome = isAdminRoute || isPortalRoute;

    return (
        <>
            {!hideSiteChrome && <PrimaryHeader logo={logo} isAuthenticated={isAuthenticated} userRole={userRole ?? ''} contentMode={contentMode} />}
            {children}
            {!hideSiteChrome && <PrimaryFooter />}
        </>
    );
}
