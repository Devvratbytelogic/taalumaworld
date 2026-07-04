import { FileText, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { getContactUsRoutePath, getFAQRoutePath } from '@/routes/routes';

export default function HeaderToolbar() {
    return (
        <>
            <div className="bg-primary text-white">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex h-9 items-center justify-between gap-4 text-xs sm:text-sm">
                        <p className="truncate font-medium text-white/95">
                            Welcome to Taaluma.World — The Global Marketplace for Mentorship, Learning & Career Architecture.
                        </p>
                        <div className="hidden shrink-0 items-center gap-1 md:flex">
                            <Link
                                href={getContactUsRoutePath()}
                                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <HelpCircle className="h-3.5 w-3.5" aria-hidden />
                                <span>Help</span>
                            </Link>
                            <Link
                                href={getFAQRoutePath()}
                                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <FileText className="h-3.5 w-3.5" aria-hidden />
                                <span>FAQs</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
