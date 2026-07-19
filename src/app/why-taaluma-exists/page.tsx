import React from 'react'
import CommonBanner from '@/components/banners/CommonBanner';
import { aboutBannerData } from '@/data/data';
import WhyTaalumaExists from '@/components/pages-components/about/WhyTaalumaExists';
import MissionVision from '@/components/pages-components/about/MissionVision';
import OurStory from '@/components/pages-components/about/OurStory';
import CoreValues from '@/components/pages-components/about/CoreValues';
import BlueprintShowcase from '@/components/pages-components/about/BlueprintShowcase';
import CommonCTA from '@/components/cta/CommonCTA';
import { getAllMentorsServerAPI } from '@/store/server-api/serverSideAPIs';
import MentorCard from '@/components/pages-components/mentor/MentorCard';
import { getAllAuthorsRoutePath, getMentorSignupRoutePath } from '@/routes/routes';
import Link from 'next/link';

export default async function AboutUsPage() {
    const response = await getAllMentorsServerAPI({ limit: 4, page: 1 });
    const mentors = response?.data?.data ?? [];

    return (
        <>
            {/* Why Taaluma Exists Banner */}
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
                <div className="container">
                    <div className='grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {mentors && mentors?.length > 0 && mentors?.map((mentor, index) => (
                            <MentorCard
                                key={index}
                                mentor={mentor}
                                index={index}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center mt-10">
                        <Link
                            className="global_btn rounded_full outline_primary w_fit"
                            href={getAllAuthorsRoutePath()}
                        >
                            View All Mentors
                        </Link>
                        <Link
                            className="global_btn rounded_full bg_primary w_fit"
                            href={getMentorSignupRoutePath()}
                        >
                            Become a Mentor
                        </Link>
                    </div>
                </div>

                {/* Featured Blueprints */}
                <BlueprintShowcase />

                {/* CTA */}
                <CommonCTA />
            </div>
        </>
    )
}
