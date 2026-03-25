import React, { Suspense } from 'react'
import LibraryContentSection from '@/components/pages-components/home/LibraryContentSection';
import ReaderTestimonials from '@/components/pages-components/home/ReaderTestimonials';
import FAQ from '@/components/pages-components/home/FAQ';
import CommonBanner from '@/components/banners/CommonBanner';
import { homeBannerData } from '@/data/data';
import LibraryContentSectionSkeleton from '@/components/skeleton-loader/LibraryContentSectionSkeleton';

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <CommonBanner data={homeBannerData} />

        {/* Main Content */}
        <div id="content-section" style={{ scrollMarginTop: '200px' }}>
          <Suspense fallback={<LibraryContentSectionSkeleton />}>
            <LibraryContentSection />
          </Suspense>
        </div>

        {/* Reader Testimonials */}
        <ReaderTestimonials />

        {/* FAQ Section */}
        <FAQ />
      </div>
    </>
  )
}
