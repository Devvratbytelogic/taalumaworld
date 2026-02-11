import React from 'react'
import LibraryContentSection from '@/components/pages-components/home/LibraryContentSection';
import ReaderTestimonials from '@/components/pages-components/home/ReaderTestimonials';
import FAQ from '@/components/pages-components/home/FAQ';
import CommonBanner from '@/components/banners/CommonBanner';
import { homeBannerData } from '@/data/data';

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <CommonBanner data={homeBannerData} />

        {/* Main Content */}
        <LibraryContentSection />

        {/* Reader Testimonials */}
        <ReaderTestimonials />

        {/* FAQ Section */}
        <FAQ />
      </div>
    </>
  )
}
