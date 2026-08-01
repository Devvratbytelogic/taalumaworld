import React from 'react'
import WhyTaalumaExistsBanner from '@/components/pages-components/about/WhyTaalumaExistsBanner';
import WhyTaalumaExists from '@/components/pages-components/about/WhyTaalumaExists';
import MissionVision from '@/components/pages-components/about/MissionVision';
import OurStory from '@/components/pages-components/about/OurStory';
import CoreValues from '@/components/pages-components/about/CoreValues';
import BlueprintShowcase from '@/components/pages-components/about/BlueprintShowcase';
import CommonCTA from '@/components/cta/CommonCTA';
import { getAllMentorsServerAPI, getGlobalSettingsServerAPI } from '@/store/server-api/serverSideAPIs';
import FeaturedMentorsSection from '@/components/pages-components/mentor/FeaturedMentorsSection';

export const revalidate = 60;

export default async function WhyTaalumaExistsPage() {
    const globalSettingsRes = await getGlobalSettingsServerAPI();
    const showMentorSection = globalSettingsRes?.data?.mentor_section_visibility !== false;

    const mentors = showMentorSection
        ? (await getAllMentorsServerAPI({ limit: 4, page: 1 }))?.data?.data ?? []
        : [];

    return (
        <>
            <div className="min-h-screen">
                {/* Why Taaluma Exists Banner */}
                <WhyTaalumaExistsBanner />

                <div className='space-y-16'>
                    {/* Why Taaluma.World Exists */}
                    <WhyTaalumaExists />

                    {/* Mission & Vision */}
                    <MissionVision />

                    {/* How Taaluma Works */}
                    <OurStory />

                    {/* Core Values + Today on Taaluma */}
                    <CoreValues />

                    {/* Learn From Mentors Around the World */}
                    {showMentorSection ? <FeaturedMentorsSection mentors={mentors} /> : null}

                    {/* Featured Blueprints */}
                    <BlueprintShowcase />

                    {/* CTA */}
                    <CommonCTA />
                </div>
            </div>
        </>
    )
}
