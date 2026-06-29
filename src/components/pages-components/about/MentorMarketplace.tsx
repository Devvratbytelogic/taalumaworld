'use client'
import { useGetUserAllAuthorsQuery } from '@/store/rtkQueries/userGetAPI'
import { useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import ImageComponent from '@/components/ui/ImageComponent'
import Button from '@/components/ui/Button'
import React from 'react'

const avatarColors = ['#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626']

export default function MentorMarketplace() {
    const router = useRouter()
    const { data, isLoading } = useGetUserAllAuthorsQuery()
    const mentors = data?.data?.items?.slice(0, 3) ?? []

    return (
        <section className="pt-8 sm:pt-16 bg-background overflow-hidden">
            <div className="container mx-auto sm:px-4">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-secondary-accent/10 border border-secondary-accent/20 px-4 py-1.5 rounded-full mb-4">
                            <Users className="w-4 h-4 text-secondary-accent" />
                            <span className="text-sm font-medium text-secondary-accent">Mentor Network</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Meet Some of Our Mentors</h2>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            Real people. Real careers. Real insights.
                        </p>
                    </div>

                    {/* Mentor Cards */}
                    {isLoading ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm animate-pulse">
                                    <div className="w-16 h-16 rounded-full bg-muted mb-4" />
                                    <div className="h-4 bg-muted rounded-full w-2/3 mb-2" />
                                    <div className="h-3 bg-muted rounded-full w-full mb-1" />
                                    <div className="h-3 bg-muted rounded-full w-4/5" />
                                </div>
                            ))}
                        </div>
                    ) : mentors.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {mentors.map((mentor, index) => (
                                <div key={mentor.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
                                    {/* Avatar */}
                                    <div className="flex items-center gap-4">
                                        {mentor.avatar ? (
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border shrink-0">
                                                <ImageComponent
                                                    src={mentor.avatar}
                                                    alt={mentor.fullName}
                                                    object_cover={true}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
                                                style={{ backgroundColor: avatarColors[index % avatarColors.length] }}
                                            >
                                                {mentor.fullName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-foreground leading-tight">{mentor.fullName}</h3>
                                            {/* {mentor.followersCount > 0 && (
                                                <p className="text-xs text-muted-foreground mt-0.5">{mentor.followersCount} followers</p>
                                            )} */}
                                        </div>
                                    </div>

                                    {/* Bio / Expertise */}
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                                        {mentor.professionalBio}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Placeholder cards when no data */
                        <div className="grid md:grid-cols-3 gap-6">
                            {['Mentor', 'Career Strategist', 'Industry Expert'].map((role, index) => (
                                <div key={role} className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-4 border border-dashed border-border">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
                                            style={{ backgroundColor: avatarColors[index] }}
                                        >
                                            ?
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{role}</h3>
                                            <p className="text-xs text-muted-foreground">Coming soon</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Our growing mentor network brings real-world expertise directly to you.
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CTA */}
                    <div className="text-center mt-10">
                        <Button
                            className="global_btn rounded_full outline_primary"
                            onPress={() => router.push('/authors')}
                        >
                            View All Mentors
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
