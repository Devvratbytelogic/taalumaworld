import React from 'react'
import Button from '@/components/ui/Button'
import Banner from '@/components/pages-components/home/Banner';
import LibraryContentSection from '@/components/pages-components/home/LibraryContentSection';
import ReaderTestimonials from '@/components/pages-components/home/ReaderTestimonials';
import FAQ from '@/components/pages-components/home/FAQ';

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <Banner />

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
