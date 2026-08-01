'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { getContactUsRoutePath } from '@/routes/routes'

export default function StillHaveQuestions() {
    const router = useRouter()

    return (
        <div className="container">
            <div className="max-w-4xl mx-auto bg-primary rounded-md p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Still have questions?</h2>
                    <p className="text-white/80 leading-relaxed">
                        Can&apos;t find what you need? Reach out to our team and we&apos;ll help you get unstuck.
                    </p>
                </div>
                <Button
                    className="global_btn rounded_full shrink-0 bg-white text-primary hover:bg-white/90 border-0"
                    onPress={() => router.push(getContactUsRoutePath())}
                >
                    Contact Us
                </Button>
            </div>
        </div>
    )
}
