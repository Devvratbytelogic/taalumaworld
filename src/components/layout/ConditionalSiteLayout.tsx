'use client';
import { usePathname } from 'next/navigation';
import PrimaryHeader from '@/components/layout/header/PrimaryHeader';
import PrimaryFooter from '@/components/layout/footer/PrimaryFooter';

export default function ConditionalSiteLayout({ children, isAuthenticated, userRole }: { children: React.ReactNode, isAuthenticated: boolean, userRole: string }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');
    const isPortalRoute = pathname.startsWith('/portal');
    const hideSiteChrome = isAdminRoute || isPortalRoute;

    return (
        <>
            {!hideSiteChrome && <PrimaryHeader isAuthenticated={isAuthenticated} userRole={userRole ?? ''} />}
            {children}
            {!hideSiteChrome && <PrimaryFooter />}
        </>
    );
}
