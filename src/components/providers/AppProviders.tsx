'use client'
import React, { Suspense } from 'react';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NextTopLoader from 'nextjs-toploader';
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import { Toaster } from '@/utils/toast';
import AllModal from '../modals/AllModal';
import { PendingAgreementsGate } from '@/components/agreements/PendingAgreementsGate';
import SocialOAuthCallbackHandler from '@/components/auth/SocialOAuthCallbackHandler';
import { AuthSessionSync } from '@/components/providers/AuthSessionSync';
import { WebPushSync } from '@/components/notifications/WebPushSync';
import { CampaignAttributionCapture } from '@/components/providers/CampaignAttributionCapture';
// import { NetworkStatusBanner } from '../network/NetworkStatusBanner';

interface ProvidersProps {
    children: React.ReactNode;
}

export function AppProviders({ children }: ProvidersProps) {
    return (
        <>
            <Provider store={store}>
                <Toaster position="bottom-right" richColors closeButton visibleToasts={1} />
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
                    <HeroUIProvider>
                        <ToastProvider maxVisibleToasts={1} placement="bottom-right" />
                        <NextTopLoader
                            color="#f7941d"
                            showSpinner={false}
                        />
                        <CampaignAttributionCapture />
                        <AuthSessionSync />
                        <WebPushSync />
                        <AllModal />
                        <Suspense fallback={null}>
                            <SocialOAuthCallbackHandler provider="linkedin" />
                            <SocialOAuthCallbackHandler provider="meta" />
                        </Suspense>
                        <PendingAgreementsGate />
                        {/* <NetworkStatusBanner /> */}
                        {children}
                    </HeroUIProvider>
                </GoogleOAuthProvider>
            </Provider>
        </>
    );
}