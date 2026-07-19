import React, { Suspense } from 'react'
import LibraryContentSection from '@/components/pages-components/home/LibraryContentSection';
import ReaderTestimonials from '@/components/pages-components/home/ReaderTestimonials';
import FAQ from '@/components/pages-components/home/FAQ';
import HeroBanner from '@/components/pages-components/home/HeroBanner';
import LibraryContentSectionSkeleton from '@/components/skeleton-loader/LibraryContentSectionSkeleton';
import AudienceSegmentation from '@/components/pages-components/home/AudienceSegmentation';
import WhatIsABlueprint from '@/components/pages-components/home/WhatIsABlueprint';
import CareerArchitectSection from '@/components/pages-components/home/CareerArchitectSection';
import { getAllMentorsServerAPI } from '@/store/server-api/serverSideAPIs';
import FeaturedMentorsSection from '@/components/pages-components/mentor/FeaturedMentorsSection';

export default async function HomePage() {
  const response = await getAllMentorsServerAPI({ limit: 4, page: 1 })
  const mentors = response?.data?.data ?? []

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroBanner />

        <div className='space-y-16'>
          {/* Who is Taaluma for — immediately below hero */}
          <AudienceSegmentation />

          {/* Featured Blueprints / Main Content */}
          <div id="content-section" style={{ scrollMarginTop: '200px' }} className="space-y-0">
            <Suspense fallback={<LibraryContentSectionSkeleton />}>
              <LibraryContentSection />
            </Suspense>
          </div>

          {/* What is a Blueprint? */}
          <WhatIsABlueprint />

          {/* Learn From Mentors Around the World */}
          <FeaturedMentorsSection mentors={mentors} />

          {/* What is a Career Architect? */}
          <CareerArchitectSection />

          {/* Reader Testimonials */}
          <ReaderTestimonials />

          {/* FAQ Section */}
          <FAQ />
        </div>
      </div>
    </>
  )
}
