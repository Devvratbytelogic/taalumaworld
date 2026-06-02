'use client'
import React from 'react';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import NextTopLoader from 'nextjs-toploader';
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import AllModal from '../modals/AllModal';
// import { NetworkStatusBanner } from '../network/NetworkStatusBanner';

interface ProvidersProps {
    children: React.ReactNode;
}

export function AppProviders({ children }: ProvidersProps) {
    return (
        <>
            <Provider store={store}>
                <Toaster position="bottom-right" richColors closeButton />
                <HeroUIProvider>
                    <ToastProvider />
                    <NextTopLoader
                        color="#f7941d"
                        showSpinner={false}
                    />
                    <AllModal />
                    {/* <NetworkStatusBanner /> */}
                    {children}
                </HeroUIProvider>
            </Provider>
        </>
    );
}