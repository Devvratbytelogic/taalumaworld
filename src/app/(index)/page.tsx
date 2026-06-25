import React, { Suspense } from 'react'
import LibraryContentSection from '@/components/pages-components/home/LibraryContentSection';
import ReaderTestimonials from '@/components/pages-components/home/ReaderTestimonials';
import FAQ from '@/components/pages-components/home/FAQ';
import CommonBanner from '@/components/banners/CommonBanner';
import { homeBannerData } from '@/data/data';
import LibraryContentSectionSkeleton from '@/components/skeleton-loader/LibraryContentSectionSkeleton';
import AudienceSegmentation from '@/components/pages-components/home/AudienceSegmentation';
import WhatIsABlueprint from '@/components/pages-components/home/WhatIsABlueprint';
import CareerArchitectSection from '@/components/pages-components/home/CareerArchitectSection';
import HomeMentorShowcase from '@/components/pages-components/home/HomeMentorShowcase';

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <CommonBanner data={homeBannerData} />

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
          <HomeMentorShowcase />
  
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
