import NormalBanner from '@/components/banners/NormalBanner'
import FaqSearch from '@/components/search/FaqSearch'
import { faqBannerData } from '@/data/data'
import React from 'react'

export default function FAQPage() {
    return (
        <>
            {/* FAQ Banner */}
            <section className="relative pt-16 md:pt-24 overflow-hidden bg-accent/30">
                <NormalBanner data={faqBannerData} />
            </section>
            
            {/* FAQ Search */}
            <FaqSearch />
        </>
    )
}
