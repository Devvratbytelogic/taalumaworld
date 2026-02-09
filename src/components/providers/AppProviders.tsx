'use client'
import React from 'react';
import { HeroUIProvider } from '@heroui/react';
import NextTopLoader from 'nextjs-toploader';

interface ProvidersProps {
    children: React.ReactNode;
}

export function AppProviders({ children }: ProvidersProps) {
    return (
        <>
            <HeroUIProvider>
                <NextTopLoader
                    color="#f7941d"
                // showSpinner={false}
                />
                {children}
            </HeroUIProvider>
        </>
    );
}