import { Suspense } from 'react'
import FaqBanner from '@/components/pages-components/faq/FaqBanner'
import StillHaveQuestions from '@/components/pages-components/faq/StillHaveQuestions'
import FaqSearch from '@/components/search/FaqSearch'
import CommonCTA from '@/components/cta/CommonCTA'
import { getFAQsServerAPI } from '@/store/server-api/serverSideAPIs'

export const revalidate = 300

type FAQPageProps = {
    searchParams: Promise<{ type?: string; search?: string }>
}

export default async function FAQPage({ searchParams }: FAQPageProps) {
    const { type, search } = await searchParams
    const faqsRes = await getFAQsServerAPI({
        type: type && type !== 'all' ? type : undefined,
        search: search?.trim() || undefined,
    })
    const faqs = faqsRes?.data?.data ?? []

    return (
        <div className="min-h-screen">
            <FaqBanner />

            <div className="space-y-16">
                <Suspense fallback={null}>
                    <FaqSearch faqs={faqs} />
                </Suspense>

                <StillHaveQuestions />

                <CommonCTA />
            </div>
        </div>
    )
}
