'use client'
import React, { Suspense } from 'react';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NextTopLoader from 'nextjs-toploader';
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import AllModal from '../modals/AllModal';
import { PendingAgreementsGate } from '@/components/agreements/PendingAgreementsGate';
import SocialOAuthCallbackHandler from '@/components/auth/SocialOAuthCallbackHandler';
// import { NetworkStatusBanner } from '../network/NetworkStatusBanner';

interface ProvidersProps {
    children: React.ReactNode;
}

export function AppProviders({ children }: ProvidersProps) {
    return (
        <>
            <Provider store={store}>
                <Toaster position="bottom-right" richColors closeButton />
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
                    <HeroUIProvider>
                        <ToastProvider />
                        <NextTopLoader
                            color="#f7941d"
                            showSpinner={false}
                        />
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