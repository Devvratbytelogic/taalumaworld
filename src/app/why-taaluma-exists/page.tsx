import React from 'react'
import CommonBanner from '@/components/banners/CommonBanner';
import { aboutBannerData } from '@/data/data';
import WhyTaalumaExists from '@/components/pages-components/about/WhyTaalumaExists';
import MissionVision from '@/components/pages-components/about/MissionVision';
import OurStory from '@/components/pages-components/about/OurStory';
import CoreValues from '@/components/pages-components/about/CoreValues';
import MentorMarketplace from '@/components/pages-components/about/MentorMarketplace';
import BlueprintShowcase from '@/components/pages-components/about/BlueprintShowcase';
import CommonCTA from '@/components/cta/CommonCTA';

export default function AboutUsPage() {
    return (
        <>
            {/* About Us Banner */}
            <CommonBanner data={aboutBannerData} />

            <div className='space-y-10'>
                {/* Why Taaluma.World Exists */}
                <WhyTaalumaExists />

                {/* Mission & Vision */}
                <MissionVision />

                {/* How Taaluma Works */}
                <OurStory />

                {/* Core Values + Today on Taaluma */}
                <CoreValues />

                {/* Meet Some of Our Mentors */}
                <MentorMarketplace />

                {/* Featured Blueprints */}
                <BlueprintShowcase />

                {/* CTA */}
                <CommonCTA />
            </div>
        </>
    )
}
