import { FileText, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function HeaderToolbar() {
    return (
        <>
            <div className="bg-primary text-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-10 text-sm">
                        <div className="flex items-center gap-2">
                            <p>Welcome to Taaluma - Empowering College Graduates & Young Professionals!</p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="#" className="hover:text-white/80 transition-colors flex items-center gap-1">
                                <HelpCircle className="h-4 w-4" />
                                <span>Help</span>
                            </Link>
                            <Link href="#" className="hover:text-white/80 transition-colors flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span>FAQs</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
