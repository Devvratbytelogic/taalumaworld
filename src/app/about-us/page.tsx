import React from 'react'
import CommonBanner from '@/components/banners/CommonBanner';
import { aboutBannerData } from '@/data/data';
import MissionVision from '@/components/pages-components/about/MissionVision';
import OurStory from '@/components/pages-components/about/OurStory';
import CoreValues from '@/components/pages-components/about/CoreValues';
import MeetOurTeam from '@/components/pages-components/about/MeetOurTeam';
import CommonCTA from '@/components/cta/CommonCTA';

export default function AboutUsPage() {
    return (
        <>
            {/* About Us Banner */}
            <CommonBanner data={aboutBannerData} />

            {/* Mission Vision */}
            <MissionVision />

            {/* Our Story */}
            <OurStory />

            {/* Core Values */}
            <CoreValues />

            {/* Meet Our Team */}
            <MeetOurTeam />

            {/* Common CTA */}
            <CommonCTA />
        </>
    )
}
