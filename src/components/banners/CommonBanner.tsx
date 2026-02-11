'use client'
import React from 'react'
import Button from '@/components/ui/Button'
import ImageComponent from '@/components/ui/ImageComponent';
import { useContentMode } from '@/hooks/useContentMode';
import { bannerProps } from '@/data/data';

interface CommonBannerProps {
    data: bannerProps;
}
export default function CommonBanner({ data }: CommonBannerProps) {
    // Use content mode hook to get current mode
    const { contentMode } = useContentMode();
    const displayMode = contentMode; // Use contentMode from the hook


    // Function to scroll to content section
    const scrollToContent = () => {
        const contentSection = document.getElementById('content-section');
        if (contentSection) {
            contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Function to scroll to categories section
    const scrollToCategories = () => {
        const categoriesSection = document.getElementById('categories-section');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    return (
        <>
            <section className="relative py-12 md:py-16 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-10 items-center" style={{ maxHeight: '900px' }}>
                        {/* Left Column - Text Content */}
                        <div className="space-y-6 animate-fade-in">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
                                <span className="text-sm font-medium text-foreground">
                                    {data?.badgeText}
                                </span>
                            </div>

                            {/* Heading */}
                            <div className="space-y-3">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                                    {data?.heading?.prefix}{' '}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">{data?.heading?.highlight}</span>
                                        <span className="absolute bottom-2 left-0 w-full h-4 bg-primary/30 -rotate-1"></span>
                                    </span>
                                    {data?.heading?.suffix}
                                </h1>
                                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                                    {data?.description}
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
                                {data?.primaryCta?.button_status && <Button
                                    className="global_btn rounded_full bg_primary"
                                    onPress={scrollToContent}
                                >
                                    {data?.primaryCta?.title}
                                </Button>}
                                {displayMode === 'books' && data?.secondaryCta?.button_status && (
                                    <Button
                                        className="global_btn rounded_full bg_primary"
                                        onPress={scrollToCategories}
                                    >
                                        {data?.secondaryCta?.title}
                                    </Button>
                                )}
                            </div>

                            {/* Stats */}
                            {data?.stats?.status && (<div className="flex items-center gap-6 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {data?.stats?.avatars && data?.stats?.avatars?.length > 0 && data?.stats?.avatars.map((item, index) => (
                                            <div key={index} className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-background`} style={{ backgroundColor: item?.bgColor }}>
                                                {item?.label}
                                            </div>
                                        ))}
                                        {/* <div className="w-8 h-8 rounded-full bg-secondary-accent flex items-center justify-center text-white text-sm font-medium border-2 border-background">
                                            {data?.stats?.avatars?.[1]?.label}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-white text-sm font-medium border-2 border-background">
                                            {data?.stats?.avatars?.[2]?.label}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-primary-dark flex items-center justify-center text-white text-xs font-medium border-2 border-background">
                                            {data?.stats?.avatars?.[3]?.label}
                                        </div> */}
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                        {data?.stats?.description}
                                    </span>
                                </div>
                            </div>)}
                        </div>

                        {/* Right Column - Illustration */}
                        <div className="relative animate-slide-up lg:block hidden">
                            <div className="relative">
                                {/* Main Illustration */}
                                <div className="relative z-10 rounded-3xl overflow-hidden" style={{ maxHeight: '650px' }}>
                                    <ImageComponent
                                        src={data?.image?.src}
                                        alt={data?.image?.alt}
                                        object_cover={true}
                                    />
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute -top-8 -left-8 w-16 h-16 bg-primary/20 rounded-full blur-2xl"></div>
                                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-secondary-accent/20 rounded-full blur-2xl"></div>

                                {/* Decorative Shapes */}
                                <div className="absolute top-1/4 -left-12 w-0 h-0 border-l-20 border-l-transparent border-r-20 border-r-transparent border-b-30 border-b-primary/30"></div>
                                <div className="absolute bottom-1/4 -right-12 w-0 h-0 border-l-15 border-l-transparent border-r-15 border-r-transparent border-t-25 border-t-secondary-accent/30"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
