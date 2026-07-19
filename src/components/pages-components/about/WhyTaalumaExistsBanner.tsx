'use client'
import React from 'react'
import ImageComponent from '@/components/ui/ImageComponent'
import { useGetActiveReadersQuery } from '@/store/rtkQueries/userGetAPI'
import ActiveReadersSkeleton from '@/components/skeleton-loader/ActiveReadersSkeleton'

const AVATAR_COLORS = ['#0A66C2', '#8B5CF6', '#10B981', '#004182']

export default function WhyTaalumaExistsBanner() {
    const { data: activeReadersData, isLoading: isActiveReadersLoading } = useGetActiveReadersQuery()

    const users = activeReadersData?.data?.users ?? []
    const total = activeReadersData?.data?.totalReaders ?? 0
    const remaining = activeReadersData?.data?.remainingReaders ?? 0

    return (
        <>
            <section className="relative py-4 sm:py-8 md:py-10 lg:py-14 overflow-hidden">
                <div className="container relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-10 lg:gap-12 items-center">
                        {/* Left Column - Text Content */}
                        <div className="space-y-2 sm:space-y-4">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 sm:px-4 py-1.5 rounded-full">
                                <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-primary" />
                                <span className="text-xs font-medium text-primary">
                                    About Taaluma.World
                                </span>
                            </div>

                            {/* Heading */}
                            <div className="space-y-3 sm:space-y-4">
                                <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                                    The Global Marketplace for Mentorship, Learning &amp; Career{' '}
                                    <span className="relative inline-block">
                                        <span className="relative z-10 gradient_text">Architecture.</span>
                                    </span>
                                </h1>
                                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                                    We help people learn from those ahead of them, mentor those behind them, and build the capacity needed to thrive in the AI Economy.
                                </p>
                                <p className="text-base sm:text-lg font-medium text-primary">
                                    Learn From Someone Ahead. Mentor Someone Behind.
                                </p>
                            </div>

                            {/* Active Readers Stats */}
                            {isActiveReadersLoading && <ActiveReadersSkeleton />}
                            {!isActiveReadersLoading && activeReadersData?.data && activeReadersData.data.totalReaders > 0 &&
                                <div className="flex items-center gap-2 pt-2">
                                    <div className="flex -space-x-2">
                                        {users.map((user, index) => (
                                            user.profilePic ? (
                                                <div
                                                    key={user.id}
                                                    className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden"
                                                >
                                                    <ImageComponent
                                                        src={user.profilePic}
                                                        alt={user.name}
                                                        object_cover={true}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    key={user.id}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium border border-gray-200"
                                                    style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
                                                >
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )
                                        ))}
                                        {remaining > 0 && (
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border border-gray-200 bg-primary">
                                                +{remaining}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                        {total.toLocaleString()}+ Strategic Career Architects
                                    </span>
                                </div>
                            }
                        </div>

                        {/* Right Column - Image */}
                        <div className="relative order-first lg:order-last">
                            {/* Decorative triangles */}
                            <span className="hidden sm:block absolute top-6 -left-4 sm:top-10 sm:-left-8 w-0 h-0 border-l-8 sm:border-l-14 border-l-transparent border-r-8 sm:border-r-14 border-r-transparent border-b-12 sm:border-b-22 border-b-primary/40 z-20" />
                            <span className="hidden sm:block absolute bottom-6 -right-3 sm:bottom-10 sm:-right-6 w-0 h-0 border-l-6 sm:border-l-10 border-l-transparent border-r-6 sm:border-r-10 border-r-transparent border-t-10 sm:border-t-18 border-t-secondary-accent/40 z-20" />

                            {/* Main image */}
                            <div className="relative z-10 rounded-md sm:rounded-xl overflow-hidden ring-1 ring-black/5 aspect-4/3">
                                <ImageComponent
                                    src="/images/common/about-img1.jpg"
                                    alt="Why Taaluma Exists Banner"
                                    object_cover={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
