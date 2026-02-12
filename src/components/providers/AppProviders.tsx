'use client'
import React from 'react';
import { HeroUIProvider } from '@heroui/react';
import NextTopLoader from 'nextjs-toploader';
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import AllModal from '../modals/AllModal';
import { AuthSync } from '../auth/AuthSync';

interface ProvidersProps {
    children: React.ReactNode;
}

export function AppProviders({ children }: ProvidersProps) {
    return (
        <>
            <Provider store={store}>
                <AuthSync />
                <Toaster position="bottom-right" richColors closeButton />
                <HeroUIProvider>
                    <NextTopLoader
                        color="#f7941d"
                    // showSpinner={false}
                    />
                    <AllModal />
                    {children}
                </HeroUIProvider>
            </Provider>
        </>
    );
}