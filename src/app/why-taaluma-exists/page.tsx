import React from 'react'
import CommonBanner from '@/components/banners/CommonBanner';
import { aboutBannerData } from '@/data/data';
import WhyTaalumaExists from '@/components/pages-components/about/WhyTaalumaExists';
import MissionVision from '@/components/pages-components/about/MissionVision';
import OurStory from '@/components/pages-components/about/OurStory';
import CoreValues from '@/components/pages-components/about/CoreValues';
import CommonCTA from '@/components/cta/CommonCTA';

export default function AboutUsPage() {
    return (
        <>
            {/* About Us Banner */}
            <CommonBanner data={aboutBannerData} />

            {/* Why Taaluma.World Exists */}
            <div className='space-y-10'>
                <WhyTaalumaExists />
    
                {/* Mission Vision */}
                <MissionVision />
    
                {/* Our Story */}
                <OurStory />
    
                {/* Core Values */}
                <CoreValues />
    
                {/* Common CTA */}
                <CommonCTA />
            </div>
        </>
    )
}
