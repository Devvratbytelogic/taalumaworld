import React, { Suspense } from 'react'
import LibraryContentSection from '@/components/pages-components/home/LibraryContentSection';
import ReaderTestimonials from '@/components/pages-components/home/ReaderTestimonials';
import FAQ from '@/components/pages-components/home/FAQ';
import HeroBanner from '@/components/pages-components/home/HeroBanner';
import LibraryContentSectionSkeleton from '@/components/skeleton-loader/LibraryContentSectionSkeleton';
import AudienceSegmentation from '@/components/pages-components/home/AudienceSegmentation';
import WhatIsABlueprint from '@/components/pages-components/home/WhatIsABlueprint';
import CareerArchitectSection from '@/components/pages-components/home/CareerArchitectSection';
import {
  getAllMentorsServerAPI,
  getFAQsServerAPI,
  getGlobalSettingsServerAPI,
  getTestimonialsServerAPI,
} from '@/store/server-api/serverSideAPIs';
import FeaturedMentorsSection from '@/components/pages-components/mentor/FeaturedMentorsSection';

export const revalidate = 300;

export default async function HomePage() {
  const [globalSettingsRes, faqsRes, testimonialsRes] = await Promise.all([
    getGlobalSettingsServerAPI(),
    getFAQsServerAPI(),
    getTestimonialsServerAPI(),
  ]);

  const showMentorSection = globalSettingsRes?.data?.mentor_section_visibility !== false

  const mentors = showMentorSection
    ? (await getAllMentorsServerAPI({ limit: 4, page: 1 }))?.data?.data ?? []
    : []

  const faqs = faqsRes?.data?.data ?? []
  const testimonials = testimonialsRes?.data ?? []

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
          {showMentorSection ? <FeaturedMentorsSection mentors={mentors} /> : null}

          {/* What is a Career Architect? */}
          <CareerArchitectSection />

          {/* Reader Testimonials */}
          <ReaderTestimonials testimonials={testimonials} />

          {/* FAQ Section */}
          <FAQ faqs={faqs} />
        </div>
      </div>
    </>
  )
}
