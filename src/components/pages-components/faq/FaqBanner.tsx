'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import ImageComponent from '@/components/ui/ImageComponent'
import { getContactUsRoutePath } from '@/routes/routes'

export default function FaqBanner() {
    const router = useRouter()

    return (
        <section className="relative py-4 sm:py-8 md:py-10 lg:py-14 overflow-hidden">
            <div className="container relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-10 lg:gap-12 items-center">
                    {/* Left Column - Text Content */}
                    <div className="space-y-2 sm:space-y-4">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 sm:px-4 py-1.5 rounded-full">
                            <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-primary" />
                            <span className="text-xs font-medium text-primary">
                                Help Center
                            </span>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                                Frequently Asked{' '}
                                <span className="gradient_text">Questions</span>
                            </h1>
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                                Find quick answers about reading, payments, accounts, and getting the most out of Taaluma.World.
                            </p>
                        </div>

                        <div className="flex flex-row items-center justify-start gap-1 lg:gap-2 pt-2">
                            <Button
                                className="global_btn rounded_full bg_primary"
                                onPress={() => {
                                    document.getElementById('faq-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                }}
                            >
                                Browse FAQs
                            </Button>
                            <Button
                                className="global_btn rounded_full outline_primary"
                                onPress={() => router.push(getContactUsRoutePath())}
                            >
                                Contact Support
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="relative order-first lg:order-last">
                        <span className="hidden sm:block absolute top-6 -left-4 sm:top-10 sm:-left-8 w-0 h-0 border-l-8 sm:border-l-14 border-l-transparent border-r-8 sm:border-r-14 border-r-transparent border-b-12 sm:border-b-22 border-b-primary/40 z-20" />
                        <span className="hidden sm:block absolute bottom-6 -right-3 sm:bottom-10 sm:-right-6 w-0 h-0 border-l-6 sm:border-l-10 border-l-transparent border-r-6 sm:border-r-10 border-r-transparent border-t-10 sm:border-t-18 border-t-secondary-accent/40 z-20" />

                        <div className="relative z-10 rounded-md sm:rounded-xl overflow-hidden ring-1 ring-black/5 aspect-4/3">
                            <ImageComponent
                                src="/images/common/about-img2.webp"
                                alt="Frequently asked questions"
                                object_cover={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
